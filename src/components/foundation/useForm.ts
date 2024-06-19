import Strings from '../../utils/string_dict.js';
import React from 'react';
import * as Yup from 'yup';

import { ITask } from '../../models/Experiment';

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

const numberSchema = Yup.number().typeError(Strings.this_field_must_be_a_number);

const getSchema = function (blocks: ITask['blocks']) {
    const keys: Record<string, Yup.AnySchema> = {};

    for (const block of blocks) {
        if (!('rk' in block)) {
            continue;
        }

        if (block.type === 'green-detector') {
            if (!block.optional) {
                keys[block.rk + '-$$g'] = numberSchema.required(Strings.this_field_is_missing);
                keys[block.rk + '-$$r'] = numberSchema.required(Strings.this_field_is_missing);
                continue;
            }

            keys[block.rk + '-$$g'] = numberSchema;
            keys[block.rk + '-$$r'] = numberSchema;
            continue;
        }

        let subSchema: Yup.AnySchema = Yup.string();

        if (
            block.type === 'number-input' ||
            block.type === 'heart-rate-input' ||
            block.type === 'slider-input' ||
            block.type === 'stopwatch'
        ) {
            subSchema = numberSchema;
        }

        if (block.type === 'stopwatch' && !block.optional) {
            subSchema = subSchema.notOneOf([0], Strings.you_need_to_time_this);
        }

        if (block.type === 'checkbox') {
            subSchema = Yup.bool();

            if (!block.optional) {
                subSchema = subSchema.oneOf([true], Strings.this_field_must_be_checked);
            }
        }

        if (!block.optional && block.type !== 'checkbox' && block.type !== 'stopwatch') {
            subSchema = subSchema.required(Strings.this_field_is_missing);
        }

        keys[block.rk] = subSchema;
    }

    return Yup.object().shape(keys);
};

const getInitialValues = function (blocks: ITask['blocks'], lookup?: Record<string, string | boolean | number>) {
    const values: Record<string, string | boolean | number> = {};

    for (const block of blocks) {
        if (!('rk' in block)) {
            continue;
        }

        if (lookup?.[block.rk]) {
            values[block.rk] = lookup[block.rk];
            continue;
        }

        if (block.type === 'checkbox') {
            values[block.rk] = false;
            continue;
        }

        if (block.type === 'green-detector') {
            values[block.rk + '-$$g'] = '';
            values[block.rk + '-$$r'] = '';
            continue;
        }

        if (block.type === 'slider-input' || block.type === 'stopwatch') {
            values[block.rk] = 0;
            continue;
        }

        if (block.type === 'movement-picker') {
            values[block.rk] = '';
            continue;
        }

        values[block.rk] = '';
    }

    return values;
};

export const useFormFromBlocks = function (
    blocks: ITask['blocks'],
    lookup?: Record<string, string | boolean | number>,
) {
    const schema = React.useMemo(() => getSchema(blocks), [blocks]);
    const initialValues = React.useMemo(() => getInitialValues(blocks, lookup), [blocks, lookup]);

    return useForm(initialValues, schema);
};
