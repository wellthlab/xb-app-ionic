import React from 'react';
import { Typography, Link } from '@mui/joy';
import ReactMarkdown from 'react-markdown';

import PageTitle from './foundation/PageTitle';

const AboutThisStudy = function () {
    return (
        <ReactMarkdown
            children={studyInformationMd}
            components={{
                h1: ({ children }) => <PageTitle>{children}</PageTitle>,

                h2: ({ children }) => (
                    <Typography level="h4" component="h2" color="primary" sx={{ mt: 4 }}>
                        {children}
                    </Typography>
                ),

                p: ({ children }) => <Typography sx={{ mt: 2 }}>{children}</Typography>,

                a: ({ children, href }) => <Link href={href}>{children}</Link>,
            }}
        />
    );
};

const studyInformationMd = `
# Welcome to August 2022 study

**Researchers:** m.c. schraefel, Nick Maguire, Marion Demossier, Pauline Leonard, Fraser
Sturt, Richard Gomer

**ERGO number:** ERGO/FEPS/62021.A1

Version 3 Last Revised 2022-03-25

## Abstract

You are being invited to take part in the above research study. To help you decide whether you would like to take part or not, it is important that you understand why the research is being done and what it will involve. Please read the information below carefully and ask questions if anything is not clear or you would like more information before you decide to take part in this research. You may like to discuss it with others, but it is up to you to decide whether or not to take part. If you are happy to participate you will be asked to give consent to participating in this research.

## What is the research about?

The research is about people’s experiences of taking up to 35 minutes per working day to engage in strength or movement practice.

We hope to understand more about the effects, and how to facilitate, movement during work; as well as collect evidence to help employers evaluate whether such schemes should be offered to their employees.

## Why have I been asked to participate?

You have been asked to participate because you are a member of staff at the University of Southampton, employed in a participating faculty or service, and are at least 18 years old.

If you do not meet those criteria, you should not participate in this study.

## What will happen to me if I take part?

During the experiment, you will be asked to install an app on your smartphone and to spend up to 35 minutes per working day engaging in tasks that are suggested by the app. Tasks range from simple “movement snacks” (short movements that take only a minute or so) to longer movement activities (such as walking or running for a period of time), and tasks which will help you to learn more about strength and movement.

During the study, you will be asked to log the time that you spend on the tasks, as well as answering other questions about your movement and general wellbeing. We will not collect data specifically about your health, but we will ask you for some limited data about your physical condition – for example, how long you’re able to hold a particular position, or how well rested you feel. All of the tasks and the questions you’ll be asked are voluntary – so you won’t have to do, or answer, anything that you are uncomfortable with.

You will be able, if you choose, to join a group with your peers, such that you will be able to compare experiences, see one anothers’ total progress in terms of movement minutes logged, and support one another.

You may, if you choose, join the Study team on Microsoft Teams, where you will be able to find more information about the study, take part in feedback sessions with the investigators, and talk to other participants. If you choose to join the Team, your name will be visible to other participants and to the study investigators. We might use things that you post in the Team to
improve the study app, or to further our understanding of the research topic. However, we will not link your activity in the Team to your wider participation, and we will not share any identifiable data from the Team with anybody who is not either a member of the Team itself or one of the investigators.

## Are there any benefits in my taking part?

Your participation will help us understand how our experiment-in-a-box approach will impact the tuning process on your behavioural patterns. We expect that many participants will feel better and develop healthy strength and movement practices as a result of taking part in the experiments.

Participating faculties have agreed that you can take up to 35 minutes from your working day to participate in this study, and that your participating in tasks suggested by the study should be
considered part of your work.

## Are there any risks involved?

There are no significant risks associated with the current study beyond those which you might encounter in your day-to-day life. However, if at any point you feel uncomfortable please let the researchers know immediately.

## What data will be collected?

We will collect information through the app about the tasks that you take part in, as well as
some information about you, like your age, job family, and the service or faculty that you work
in.

## Will my participation be confidential?

Information that can be linked to you will be kept strictly confidential, but you may choose to share with colleagues that you are taking part. In some faculties or services, you may need to tell your line manager that you are participating. Data that we collect during the study will NOT be shared your line manager; and only anonymous results will be shared in publications or
with the University.

We will create some anonymous datasets, which cannot be linked back to you or any specific individual, and will share those datasets as ‘open data’, available for anybody to analyse.

Only members of the research team and responsible members of the University of Southampton may be given access to your personal data. Personal data will be used only for research purposes, for monitoring purposes, and/or to carry out an audit of the study to ensure that the research is complying with applicable regulations. Individuals from regulatory authorities (people who
check that we are carrying out the study correctly) may require access to your data. All of these people have a duty to keep your information, as a research participant, strictly confidential.

As far as possible, your data will be kept secure. We will not publish any datasets or findings that could be linked back to you, or which disclose your identity or personal involvement in the
study.

## Do I have to take part?

No, it is entirely up to you to decide whether or not to take part. If you decide you want to take part, you will need to sign a consent form to show you have agreed to take part.

Your faculty or service, manager or colleagues cannot insist that you take part in this study;
and you should not feel that you have to take part.

## What happens if I change my mind?

You have the right to change your mind and withdraw at any time without giving a reason and without your participant rights being affected.

## What will happen to the results of the research?

Your personal details will remain strictly confidential. Research findings made available in any reports or publications will not include information that can directly identify you without your specific consent.

The results of the study will be used in writing up a research paper, may be included in publications, and may also be used to inform related studies.

## Where can I get more information?

If you have any further questions regarding the study, please email Prof m.c. schraefel – [mc@ecs.soton.ac.uk](#mailto:mc@ecs.soton.ac.uk)

## What happens if there is a problem?

If you have a concern about any aspect of this study, you should speak to the researchers who will do their best to answer your questions.

If you remain unhappy or have a complaint about any aspect of this study, please contact the University of Southampton Research Integrity and Governance Manager (023 8059 5058)
[rgoinfo@soton.ac.uk](#mailto:rgoinfo@soton.ac.uk)

## Data Protection Privacy Notice

The University of Southampton conducts research to the highest standards of research integrity. As a publicly-funded organisation, the University has to ensure that it is in the public interest when we use personally-identifiable information about people who have agreed to take part in research. This means that when you agree to take part in a research study, we will use information about you in the ways needed, and for the purposes specified, to conduct and
complete the research project. Under data protection law, ‘Personal data’ means any information that relates to and is capable of identifying a living individual. The University’s data protection policy governing the use of personal data by the University can be found on its
[website](#https://www.southampton.ac.uk/legalservices/what-we-do/data-protection-and-foi.page).

This Participant Information Sheet tells you what data will be collected for this project and whether this includes any personal data. Please ask the research team if you have any questions or are unclear what data is being collected about you.

Our privacy notice for research participants provides more information on how the University of Southampton collects and uses your personal data when you take part in one of our research projects and can be found [here](#http://www.southampton.ac.uk/assets/sharepoint/intranet/ls/Public/Research%20and%20Integrity%20Privacy%20Notice/Privacy%20Notice%20for%20Research%20Participants.pdf).

Any personal data we collect in this study will be used only for the purposes of carrying out our research and will be handled according to the University’s policies in line with data protection law. If any personal data is used from which you can be identified directly, it will not be disclosed to anyone else without your consent unless the University of Southampton is
required by law to disclose it.

Data protection law requires us to have a valid legal reason (‘lawful basis’) to process and use your Personal data. The lawful basis for processing personal information in this research study is for the performance of a task carried out in the public interest. Personal data collected for research will not be used for any other purpose.

For the purposes of data protection law, the University of Southampton is the ‘Data Controller’ for this study, which means that we are responsible for looking after your information and using it properly. The University of Southampton will keep identifiable information about you for 1 year after the study has finished after which time any link between you and your information
will be removed.

To safeguard your rights, we will use the minimum personal data necessary to achieve our research study objectives. Your data protection rights – such as to access, change, or transfer such information - may be limited, however, in order for the research output to be reliable and accurate. The University will not do anything with your personal data that you would not
reasonably expect.

If you have any questions about how your personal data is used, or wish to exercise any of your rights, please consult the University’s data protection [webpage](#https://www.southampton.ac.uk/legalservices/what-we-do/data-protection-and-foi.page) where you can make a request using our online form. If you need further assistance, please contact the University’s Data Protection Officer ([data.protection@soton.ac.uk](#mailto:data.protection@soton.ac.uk)).

## Thank you

Thank you for taking the time to read the information sheet and considering taking part in the research.
`;

export default AboutThisStudy;
