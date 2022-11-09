import React from 'react';
import * as Yup from 'yup';

interface IBaseInputProps {
    helperText?: string;
    error: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

type GetInputProps<T> = <TKey extends keyof T>(
    name: TKey,
) => IBaseInputProps & { value: T[TKey]; onFocus: () => void; onBlur: () => void };

type GetCheckboxProps<T> = <TKey extends keyof T>(name: TKey) => IBaseInputProps & { checked: T[TKey] };

type CreateHandleSubmit<TS extends Yup.ObjectSchema<any>> = (
    handleSubmit: (data: Yup.Asserts<TS>) => void,
) => () => void;

type Errors<T> = {
    [K in keyof T]?: string;
};

interface IUseFormReturns<T, TS extends Yup.ObjectSchema<any>> {
    form: {
        values: T;
        dirty: boolean;
        errors: Errors<T>;
        resetErrors: () => void;
        resetDirty: () => void;
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
        result[error.path!] = error.message;
    }

    return result;
};

const useForm = function <T extends Record<string, string | boolean | null>, TS extends Yup.ObjectSchema<any>>(
    initial: T,
    schema: TS,
): IUseFormReturns<T, TS> {
    const [values, setValues] = React.useState(initial);
    const [dirty, setDirty] = React.useState(false);
    const [errors, setErrors] = React.useState<Errors<T>>({});

    const getBaseInputProps = function <TKey extends keyof T>(name: TKey): IBaseInputProps {
        return {
            helperText: errors[name],
            error: !!errors[name],

            onChange: (e) => {
                if (!dirty) {
                    setDirty(true);
                }

                setValues({
                    ...values,
                    [name]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
                });
            },
        };
    };

    const resetErrors = function () {
        setErrors({});
    };

    const resetDirty = function () {
        setDirty(false);
    };

    const resetValues = function () {
        setValues(initial);
    };

    return {
        form: {
            values,
            dirty,
            errors,

            resetErrors,
            resetDirty,
            resetValues,
            resetForm: () => {
                resetErrors();
                resetDirty();
                resetValues();
            },
        },

        getInputProps: (name) => {
            return {
                value: values[name],

                onBlur: () => {
                    try {
                        schema.validateSync(values, { abortEarly: false });
                    } catch (error) {
                        if (error instanceof Yup.ValidationError) {
                            for (const subError of error.inner) {
                                if (subError.path === name) {
                                    return setErrors({ ...errors, [name]: subError.message });
                                }
                            }

                            return;
                        }
                    }
                },

                onFocus: () => {
                    const newErrors = { ...errors };
                    delete newErrors[name];
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
                        throw new Error('Oops, please check your form again');
                    }

                    return;
                }

                setErrors({});
                await handleSubmit(finalValues);
            };
        },
    };
};

export default useForm;
