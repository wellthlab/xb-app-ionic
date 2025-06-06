import React from 'react';
import Form from '../../components/foundation/Form';
import Strings from '../../utils/string_dict';
import Checkbox from '../../components/foundation/Checkbox';
import * as Yup from 'yup';
import useForm from '../../components/foundation/useForm';
import { Box, Button } from '@mui/joy';
import Page from '../../components/foundation/Page';

const questions = [
    'Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?',
    'Do you feel pain in your chest when you do physical activity?',
    'In the past month, have you had chest pain when you were not doing physical activity?',
    'Do you lose your balance because of dizziness or do you ever lose consciousness?',
    'Do you have a bone or joint problem that could be made worse by a change in your physical activity?',
    'Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?',
    'Do you know of any other reason why you should not do physical activity?',
];

const checkboxSchema = Yup.bool();

export function ParQScreen({ parQ, setParQ }: { parQ: any; setParQ: (v: any) => void }) {
    const [next, setNext] = React.useState(() => parQ !== null && !parQ.pass && !parQ.consulted);

    const initialSchema = React.useMemo(() => {
        const schemaKeys = questions.reduce((acc, v, i) => {
            acc[`c${i}`] = checkboxSchema;
            return acc;
        }, {} as Record<string, Yup.AnySchema>);

        return Yup.object().shape(schemaKeys);
    }, []);

    const initialFormState = React.useMemo(() => {
        return questions.reduce((acc, v, i) => {
            acc[`c${i}`] = false;
            return acc;
        }, {} as Record<string, boolean>);
    }, []);

    const { getCheckboxProps, createHandleSubmit, form } = useForm(initialFormState, initialSchema);

    const handleSubmit = createHandleSubmit((data) => {
        for (const key of Object.keys(data)) {
            if (!data[key]) {
                localStorage.setItem('parq', JSON.stringify({ pass: false, consulted: false }));
                setNext(true);
                return;
            }
        }

        localStorage.setItem('parq', JSON.stringify({ pass: true, consulted: true }));
        setParQ({ pass: true, consulted: true });
        return;
    });

    return (
        <Page>
            {!next ? (
                <Form submitLabel={Strings.next} message={form.errors.$root} onSubmit={handleSubmit}>
                    {questions.map((question, i) => (
                        <Checkbox key={i} label={question} {...getCheckboxProps(`c${i}`)} />
                    ))}
                </Form>
            ) : (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        alignItems: 'center',
                    }}
                >
                    You need to consult a GP before continue
                    <Button
                        variant="solid"
                        onClick={() => {
                            localStorage.setItem('parq', JSON.stringify({ pass: false, consulted: true }));
                            setParQ({ pass: false, consulted: true });
                        }}
                    >
                        I have consulted my GP
                    </Button>
                </Box>
            )}
        </Page>
    );
}
