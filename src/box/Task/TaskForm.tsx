import React from 'react';
import { TextField } from '@mui/joy';
import * as Yup from 'yup';

import { ITask } from '../../common/models/Box';
import { Checkbox, Form, Select, useForm } from '../../common/ui/form';

type Inputs = NonNullable<ITask['inputs']>;

interface ITaskFormProps {
    inputs: Inputs;
}

const generateInitialValues = function (inputs: Inputs) {
    const values: Record<string, string | boolean> = {};
    for (const input of inputs) {
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

const TaskForm = function ({ inputs }: ITaskFormProps) {
    const schema = React.useMemo(() => generateSchema(inputs), [inputs]);
    const initial = generateInitialValues(inputs);

    const { createHandleSubmit, getInputProps, getCheckboxProps } = useForm(initial, schema);

    const handleSubmit = createHandleSubmit(() => {});

    return (
        <Form onSubmit={handleSubmit}>
            {inputs.map((input) => {
                const commonProps = {
                    label: input.label,
                    required: !input.optional,
                    key: input.label,
                    helperText: input.help,
                };

                if (input.type === 'text' || input.type === 'number') {
                    return <TextField type={input.type} {...commonProps} {...(getInputProps(input.label) as any)} />;
                }

                if (input.type === 'select') {
                    return <Select options={input.options} {...commonProps} {...(getInputProps(input.label) as any)} />;
                }

                if (input.type === 'checkbox') {
                    return <Checkbox {...commonProps} {...(getCheckboxProps(input.label) as any)} />;
                }

                return <div>HeartRate</div>;
            })}
        </Form>
    );
};

export default TaskForm;
