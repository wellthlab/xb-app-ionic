import React from 'react';
import { TextField } from '@mui/joy';
import * as Yup from 'yup';

import HeartrateInput from './HeartrateInput';
import { ITask, IResponse } from '../../common/models/Box';
import { Checkbox, Form, Select, useForm } from '../../common/ui/form';

type Inputs = NonNullable<ITask['inputs']>;

interface ITaskFormProps {
    inputs: Inputs;
    response?: IResponse;
    onSubmit: (data: IResponse['payload'], draft: boolean) => void;
}

const generateInitialValues = function (inputs: Inputs, response: IResponse | undefined) {
    const values: Record<string, string | boolean> = {};
    for (const input of inputs) {
        if (response) {
            const value = response.payload[input.label];
            values[input.label] = typeof value === 'number' ? value.toString() : value;
            continue;
        }

        let initialValue: string | boolean = '';

        if (input.type === 'checkbox') {
            initialValue = false;
        }

        values[input.label] = initialValue;
    }

    return values;
};

const generateSchema = function (inputs: Inputs) {
    console.log('Schema created');

    const keys: Record<string, Yup.AnySchema> = {};

    for (const input of inputs) {
        let subSchema: Yup.AnySchema = Yup.string();

        if (input.type === 'number' || input.type === 'heartrate') {
            subSchema = Yup.number().typeError('This field must be a number');
        }

        if (input.type === 'checkbox') {
            subSchema = Yup.bool();

            if (!input.optional) {
                subSchema = subSchema.oneOf([true], 'This field must be checked');
            }
        }

        if (!input.optional && input.type !== 'checkbox') {
            subSchema = subSchema.required('This field is missing');
        }

        keys[input.label] = subSchema;
    }

    return Yup.object().shape(keys);
};

const TaskForm = function ({ inputs, onSubmit, response }: ITaskFormProps) {
    const schema = React.useMemo(() => generateSchema(inputs), [inputs]);
    const initial = generateInitialValues(inputs, response);

    const { createHandleSubmit, getInputProps, getCheckboxProps } = useForm(initial, schema);

    const wrapHandleSubmit = function (options: { draft: boolean; skipValidation: boolean }) {
        return createHandleSubmit((data) => onSubmit(data, options.draft), {
            skipValidation: options.skipValidation,
        });
    };

    return (
        <Form
            onSubmit={wrapHandleSubmit({ draft: false, skipValidation: false })}
            extraButtonLabel="Save draft"
            onExtraButtonClick={wrapHandleSubmit({ draft: true, skipValidation: true })}
        >
            {inputs.map((input) => {
                const commonProps = {
                    label: input.label,
                    required: !input.optional,
                    key: input.label,
                    helperText: input.help,
                };

                if (input.type === 'select') {
                    return <Select options={input.options} {...commonProps} {...(getInputProps(input.label) as any)} />;
                }

                if (input.type === 'checkbox') {
                    return <Checkbox {...commonProps} {...(getCheckboxProps(input.label) as any)} />;
                }

                if (input.type === 'heartrate') {
                    return <HeartrateInput {...commonProps} {...(getInputProps(input.label) as any)} />;
                }

                return <TextField type={input.type} {...commonProps} {...(getInputProps(input.label) as any)} />;
            })}
        </Form>
    );
};

export default TaskForm;
