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
# Crowdsourcing Journey Experience: A Comparative Study

**Researcher:** Dr Selin Zileli, Dr Richard Gomer

**ERGO number:** 82759

You are being invited to take part in the above research study. To help you decide whether you would like to take part or not, it is important that you understand why the research is being done and what it will involve. Please read the information below carefully and ask questions if anything is not clear or you would like more information before you decide to take part in this research. You may like to discuss it with others but it is up to you to decide whether or not to take part. If you are happy to participate you will be asked to sign a consent form.
## What is the research about?
This postdoctoral research aims to investigate journey experiences to contribute to the development of more effective and sustainable transportation systems. By understanding the situations, actors, and sensitivities of users, the study seeks to inform interventions into the complexities of sustainable urban mobility and improve the overall journey experience for individuals.
## Why have I been asked to participate?
You have been chosen for this experiment as you are over the age of 18 years old and have a regular commuting, leisure, or other travel habits.
## What will happen to me if I take part?
There is going to be 2 ways (paper and digital interface) to collect data for this project. Here is an overview of what typically happens to the participants:
1. Data Collection (In-Person Phase): You will log-in with your email address to the digital application and share your journey experiences and provide data on routes, behaviours, and actions through two interfaces: paper-based and digital. In the paper-based interface, you will annotate routes using maps, stickers, and post-its. In the digital interface, you will use an app with digital versions of the paper-based tools and download and export your GPS history data from Google Timeline.
2. Data Collection (Participant’s Independent Evaluation Phase): After the in-person testing, you will have the opportunity to independently explore and utilize both interfaces over the next few days for your daily journeys.
3. Feedback Session: After the independent evaluation phase, you will be invited to a follow-up semi-structured interview aimed at gathering your feedback on the qualitative annotation interfaces. This session provides an opportunity for you to share your thoughts, opinions, and suggestions regarding your user experience. You can discuss any issues encountered and provide input on improving the usability and user-friendliness of the interfaces to better capture your journey experiences. The interview will be conducted online. If agreed upon by you, the interview may be audio-recorded to create a transcription for further analysis.
4. Data Analysis: The collected data from both phases, including annotated routes, feedback from the follow-up interviews, and any audio recordings, will be analysed. This analysis will involve identifying patterns, themes, and insights related to the usability, user experience, and effectiveness of the qualitative annotation interfaces. The findings will be interpreted and used to refine the interfaces and enhance the data collection process for capturing journey experiences effectively.
5. Conclusion of Participation: Once you have completed your involvement in the study, your anonymised data and consent form will be securely stored and retained for 10-years period. If desired, we can offer you a debriefing session where we can provide any necessary additional information or resources related to the study.
## Are there any benefits in my taking part?
Participating in this research study has several potential benefits for individuals. Firstly, it allows them to contribute to scientific research, advancing our understanding of journey experiences and sustainable transportation systems. Additionally, you can directly influence the design and improvement of journey experience data collection systems through your input and feedback, shaping more user-friendly interfaces. Lastly, taking part in the study enhances your self-awareness of your own journey experiences, empowering you to make informed decisions and contribute to the development of better transportation systems.
## Are there any risks involved?
There are not any risks involved for this research.
## What data will be collected?
As part of this study, your name, occupation, age, consent form and contact information based on your preference will be collected. The consent form will be digitised, numbered and hard copy version will be shredded. These are personal to you and will be kept securely on a University of Southampton, password- protected desktop that only we (the researchers mentioned in this form) can access.
In addition, through the study, we will collect specific information about one of your recent journeys, such as the destination, route, activities you have performed during the journey, and your experiences, including emotions and senses engaged with throughout the journey. We will also gather your feedback about the study and your experience with the data collection process.
## Will my participation be confidential?
Your participation and the information we collect about you during the course of the research will be kept strictly confidential.
Only members of the research team and responsible members of the University of Southampton may be given access to data about you for monitoring purposes and/or to carry out an audit of the study to ensure that the research is complying with applicable regulations. Individuals from regulatory authorities (people who check that we are carrying out the study correctly) may require access to your data. All these people have a duty to keep your information, as a research participant, strictly confidential.
The information provided in the recruitment survey will only be used to contact and communicate with you and will be deleted securely after the study concludes. Consent forms will be stored securely as digital copies with restricted access. Data collected through digital and paper interfaces will be stored securely and personal identifiers will be removed for anonymity and confidentiality.
## Do I have to take part?
No, it is entirely up to you to decide whether or not to take part. If you decide you want to take part, you will need to sign a consent form to show you have agreed to take part.
If any time during the research you decide that you do not want to continue, please contact us to inform us of your decision.
## What happens if I change my mind?
You have the right to change your mind and withdraw at any time without giving a reason and without your participant rights being affected.
Your participation is fully voluntary, and you can withdraw consent at any time without impacting your legal rights or justification. You can withdraw from the research by returning the probe kit and contacting us.
If you withdraw from the study, we will keep the information about you that we have already obtained for the purposes of achieving the objectives of the study only.
## What will happen to the results of the research?
Your personal details will remain strictly confidential. Research findings made available in any reports or publications will not include information that can directly identify you without your specific consent.
The research project's findings will be analysed and documented and may be published or presented at academic conferences without revealing your personal details. You can request a summary of the research results. Anonymised data from this research may be shared for future studies while ensuring participant confidentiality and compliance with data protection regulations. Contact information for the researcher and institution will be provided for further inquiries or complaints.
## Where can I get more information?
Should you require any additional information, please contact through either [S.Zileli@soton.ac.uk](#mailto:S.Zileli@soton.ac.uk) or [r.c.gomer@soton.ac.uk](#mailto:r.c.gomer@soton.ac.uk).
## What happens if there is a problem?
If you have a concern about any aspect of this study, you should speak to the researchers who will do their best to answer your questions.
If you remain unhappy or have a complaint about any aspect of this study, please contact the University of Southampton Head of Research Ethics and Clinical Governance (023 8059 5058, [rgoinfo@soton.ac.uk](#mailto:rgoinfo@soton.ac.uk)).
You can contact with the research team through [S.Zileli@soton.ac.uk](#mailto:S.Zileli@soton.ac.uk) with Dr Selin Zileli or [r.c.gomer@soton.ac.uk](#mailto:r.c.gomer@soton.ac.uk) with Dr Richard Gomer.
## Data Protection Privacy Notice
The University of Southampton conducts research to the highest standards of research integrity. As a publicly-funded organisation, the University has to ensure that it is in the public interest when we use personally-identifiable information about people who have agreed to take part in research. This means that when you agree to take part in a research study, we will use information about you in the ways needed, and for the purposes specified, to conduct and complete the research project. Under data protection law, ‘Personal data’ means any information that relates to and is capable of identifying a living individual. The University’s data protection policy governing the use of personal data by the University can be found on its [website](#https://www.southampton.ac.uk/legalservices/what-we-do/data-protection-and-foi.page).

This Participant Information Sheet tells you what data will be collected for this project and whether this includes any personal data. Please ask the research team if you have any questions or are unclear what data is being collected about you.

Our privacy notice for research participants provides more information on how the University of Southampton collects and uses your personal data when you take part in one of our research projects and can be found at [website](#http://www.southampton.ac.uk/assets/sharepoint/intranet/ls/Public/Research%20and%20Integrity%20Privacy%20Notice/Privacy%20Notice%20for%20Research%20Participants.pdf)

Any personal data we collect in this study will be used only for the purposes of carrying out our research and will be handled according to the University’s policies in line with data protection law. If any personal data is used from which you can be identified directly, it will not be disclosed to anyone else without your consent unless the University of Southampton is required by law to disclose it.

Data protection law requires us to have a valid legal reason (‘lawful basis’) to process and use your Personal data. The lawful basis for processing personal information in this research study is for the performance of a task carried out in the public interest. Personal data collected for research will not be used for any other purpose.

For the purposes of data protection law, the University of Southampton is the ‘Data Controller’ for this study, which means that we are responsible for looking after your information and using it properly. The University of Southampton will keep identifiable information about you for xx years after the study has finished after which time any link between you and your information will be removed.

To safeguard your rights, we will use the minimum personal data necessary to achieve our research study objectives. Your data protection rights – such as to access, change, or transfer such information - may be limited, however, in order for the research output to be reliable and accurate. The University will not do anything with your personal data that you would not reasonably expect.

If you have any questions about how your personal data is used, or wish to exercise any of your rights, please consult the University’s data protection [webpage](#https://www.southampton.ac.uk/legalservices/what-we-do/data-protection-and-foi.page) where you can make a request using our online form. If you need further assistance, please contact the University’s Data Protection Officer [data.protection@soton.ac.uk](#mailto:data.protection@soton.ac.uk).

The data mentioned and collected through this study will be kept for 10 years.
Through the 10-years period, the data will be pseudonymised to reduce the privacy risks by making more difficult to identify individuals. Pseudonymisation will be made by linking data using a code and these codes only accessible by the two researchers who are indicated at the beginning of this documents.

## Thank you.

Thank you for taking the time to read the participant information sheet and considering taking part in the research.
`;

export default AboutThisStudy;
