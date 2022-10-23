import React from 'react';
import * as Yup from 'yup';

interface IBaseInputProps {
    helperText?: string;
    error: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onFocus: () => void;
    onBlur: () => void;
}

type GetInputProps<T> = <TKey extends keyof T>(name: TKey) => IBaseInputProps & { value: T[TKey] };

type GetCheckboxProps<T> = <TKey extends keyof T>(name: TKey) => IBaseInputProps & { checked: T[TKey] };

type CreateHandleSubmit<T> = (handleSubmit: (data: T) => void) => () => void;

type Errors<T> = {
    [K in keyof T]?: string;
};

interface IUseFormReturns<T> {
    getInputProps: GetInputProps<T>;
    getCheckboxProps: GetCheckboxProps<T>;
    createHandleSubmit: CreateHandleSubmit<T>;
}

const processErrors = function (errors: Yup.ValidationError[]) {
    const result: Record<string, string> = {};
    for (const error of errors) {
        result[error.path!] = error.message;
    }

    return result;
};

const useForm = function <T extends Record<string, string | boolean>>(
    initial: T,
    schema: Yup.ObjectSchema<any>,
): IUseFormReturns<T> {
    const [values, setValues] = React.useState(initial);
    const [errors, setErrors] = React.useState<Errors<T>>({});

    const getBaseInputProps = function <TKey extends keyof T>(name: TKey): IBaseInputProps {
        return {
            helperText: errors[name],
            error: !!errors[name],

            onChange: (e) => {
                setValues({
                    ...values,
                    [name]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
                });
            },

            onBlur: () => {
                try {
                    schema.validateSyncAt(name as string, { [name]: values[name] });
                } catch (error) {
                    if (error instanceof Yup.ValidationError) {
                        setErrors({ ...errors, [name]: error.message });
                        return;
                    }
                }
            },

            onFocus: () => {
                const newErrors = { ...errors };
                delete newErrors[name];
                setErrors(newErrors);
            },
        };
    };

    return {
        getInputProps: (name) => {
            return {
                value: values[name],
                ...getBaseInputProps(name),
            };
        },

        getCheckboxProps: (name) => ({
            checked: values[name],
            ...getBaseInputProps(name),
        }),

        createHandleSubmit: (handleSubmit) => {
            return async () => {
                try {
                    schema.validateSync(values, { abortEarly: false });
                } catch (error) {
                    if (error instanceof Yup.ValidationError) {
                        setErrors(processErrors(error.inner));
                        throw new Error('Oops, please check your form again');
                    }

                    return;
                }

                setErrors({});
                await handleSubmit(values);
            };
        },
    };
};

export default useForm;
