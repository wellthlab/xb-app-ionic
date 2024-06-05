import Strings from '../../utils/string_dict';
import React from 'react';
import * as Yup from 'yup';

interface IBaseInputProps {
    helperText?: string;
    error: boolean;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | string | number,
    ) => void;
}

type GetInputProps<T> = <TKey extends keyof T>(
    name: TKey,
) => IBaseInputProps & { value: T[TKey]; onFocus: () => void; onBlur: () => void };

type GetCheckboxProps<T> = <TKey extends keyof T>(name: TKey) => IBaseInputProps & { checked: T[TKey] };

type CreateHandleSubmit<TS extends Yup.ObjectSchema<any>> = (
    handleSubmit: (data: Yup.Asserts<TS>) => void,
) => () => void;

type Errors<T> = {
    [K in keyof T | '$root']?: string;
};

interface IUseFormReturns<T, TS extends Yup.ObjectSchema<any>> {
    form: {
        values: T;
        errors: Errors<T>;
        hasError: () => boolean;
        resetErrors: () => void;
        resetValues: () => void;
        resetForm: () => void;
    };
    getInputProps: GetInputProps<T>;
    getCheckboxProps: GetCheckboxProps<T>;
    createHandleSubmit: CreateHandleSubmit<TS>;
}

const processErrors = function (errors: Yup.ValidationError[]) {
    const result: Record<string, string> = {};
    for (const error of errors) {
        result[error.path || '$root'] = error.message;
    }

    return result;
};

const useForm = function <T extends Record<string, string | boolean | number | null>, TS extends Yup.ObjectSchema<any>>(
    initial: T,
    schema: TS,
): IUseFormReturns<T, TS> {
    const [values, setValues] = React.useState(initial);
    const [errors, setErrors] = React.useState<Errors<T>>({});

    const getBaseInputProps = function <TKey extends keyof T>(name: TKey): IBaseInputProps {
        return {
            helperText: errors[name],
            error: !!errors[name],

            onChange: (e) => {
                // Use callback here because sometimes multiple onChange will be called
                setValues((prevValues) => ({
                    ...prevValues,
                    [name]:
                        typeof e === 'string' || typeof e === 'number'
                            ? e
                            : e.target.type === 'checkbox'
                            ? (e.target as HTMLInputElement).checked
                            : e.target.value,
                }));
            },
        };
    };

    const resetErrors = function () {
        setErrors({});
    };

    const resetValues = function () {
        setValues(initial);
    };

    const resetForm = function () {
        resetErrors();
        resetValues();
    };

    return {
        form: {
            values,
            errors,

            hasError: () => {
                return Object.keys(errors).length > 0;
            },

            resetErrors,
            resetValues,
            resetForm,
        },

        getInputProps: (name) => {
            return {
                value: values[name],

                onBlur: () => {
                    try {
                        schema.validateSyncAt(name.toString(), values, { abortEarly: false });
                    } catch (error) {
                        if (error instanceof Yup.ValidationError) {
                            return setErrors({ ...errors, [name]: error.message });
                        }

                        return;
                    }
                },

                onFocus: () => {
                    const newErrors = { ...errors };
                    delete newErrors[name];
                    delete newErrors.$root;
                    setErrors(newErrors);
                },

                ...getBaseInputProps(name),
            };
        },

        getCheckboxProps: (name) => ({
            checked: values[name],
            ...getBaseInputProps(name),
        }),

        createHandleSubmit: (handleSubmit) => {
            return async () => {
                let finalValues;
                try {
                    finalValues = schema.validateSync(values, { abortEarly: false });
                } catch (error) {
                    if (error instanceof Yup.ValidationError) {
                        setErrors(processErrors(error.inner));
                    }

                    return;
                }

                setErrors({});

                try {
                    await handleSubmit(finalValues);
                } catch (error) {
                    console.log(error);
                    setErrors({
                        $root:
                            typeof error === 'string'
                                ? error
                                : (error as any).message
                                ? (error as any).message
                                : Strings.sorry_cannot_submit_this_form,
                    });
                }
            };
        },
    };
};

export default useForm;
