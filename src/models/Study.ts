import { Block } from './Experiment';

export interface IStudy {
    id: string;
    studyInfo: Block[];
    consent: string[];
    profile: Block[];
    welcome: any[];
}

class Study {
    static getCurrentStudy(): IStudy {
        return {
            id: 'stubbed_study',
            consent: [
                'I have read the provided participant information and consent to take part in the study',
                'I am at least 18 years old.',
                'I understand that physical activity can pose the risk of injury, and I have checked that it is safe for me to take part',
            ],
            profile: [
                {
                    type: 'select-input',
                    label: 'Gender',
                    rk: 'gender',
                    options: ['Male', 'Female', 'Other ', 'Prefer not to say'],
                    optional: true,
                },
                { type: 'number-input', label: 'Age', rk: 'age', optional: true },
            ],
            welcome: [
                {
                    title: 'Welcome to XB',
                    mainText:
                        'Welcome to your own XB Lab to explore how you can Build, Burn, Recover\n                                                Better',
                    secondaryText:
                        'The following pages offer an overview of how XB – the Experiment in a Box App –\n                                        works to help you explore health concepts for yourself – to build up your own\n                                        health knowledge skills and practice (KSP) to feel, how you feel, better.',
                    image: '/assets/graphics/welcome.png',
                },
                {
                    title: 'In XB, all related Experiments are in one BOX',
                    mainText:
                        'So all the MOVE experiments are in the MOVE box, all the Sleep ones, in the Sleep box, and all the EAT ones in the eat box.\n',
                    secondaryText:
                        'From the BOXES icon in the TAB at the bottom of the page, you can choose both HOW MANY boxes you’d like to try together, from picking 1, 2 or 3 boxes, to what boxes you’d like to combine – just move, just sleep, sleep and eat – or move eat sleep – it’s up to you.\n\nYou’ll be able to explore what’s inside each box before you choose to subscribe. For this pilot study, we’d appreciate you choosing all three to test them out for us – thank you. To CHOOSE boxes you SUBSCRIBE to that box.',
                    image: 'assets/graphics/exp.png',
                },
                {
                    title: 'XB - You are the scientist',
                    mainText: 'You run experiments to see what health ideas word for you',
                    secondaryText:
                        'In XB, your lab BOX contains experiments for yout to run. These are science-tested health practices for you to test for yourself: ALL DATA is GOOD DATA. The important thing is: how do these practices work - FOR YOU to help YOU feel, how you feel, better - anytime; anywhere',
                    image: 'assets/graphics/scientist.png',
                },
                {
                    title: 'An XB Experiment Week',
                    mainText: 'Each Experiment in an XB Box lasts for 5 days in a week - from Monday to Friday',
                    secondaryText:
                        'We encourage folks to use the weekends to explore ideas to prepare for the experiments to come in the next week',
                    image: '/assets/graphics/weeks.png',
                },
            ],
            studyInfo: [
                { type: 'image', src: '/assets/graphics/studyinfo.png', alt: 'Study information graphic' },
                {
                    content:
                        'About This XB App pilot study\n\n**WELCOME to the Experiment in a Box Beta Test**\n\nThis app is a guide to help you run a series of self-experiments to test out health ideas, validated by science, to see how they work for you, to help you Build (Move), Burn (Eat), Recover(Sleep) Better.\n\nIn this pilot, we’re particularly interested to hear from you about how well the app supports this process – what’s working well; what might work better.\n\n**YOUR INFORMED CONSENT**: As part of this study, we ask that you agree to share the results of your experiemnts with us.\n\nAs a research study, we need to make SURE before you continue that you understand and consent to the data that we’re asking you to share – anonymously – with us to help support folks feel, how we feel, better\n\nTo help you decide whether you would like to take part or not, it is important that you understand why the research is being done and what it will involve.\n\nPlease read the information below carefully and ask questions if anything is not clear or you would like more information before you decide to take part in this research. You may like to discuss it with others, but it is up to you to decide whether or not to take part. If you are happy to participate you will be asked to give consent to participating in this research.\n',
                    type: 'markdown',
                },
                {
                    type: 'expandable',
                    title: 'What is the research about?',
                    contents: [
                        {
                            content:
                                "Our health and wellbeing depends on how ell we TUNE five things:\n\n1. **MOVE**\n2. ENGAGE\n3. **EAT**\n4. COGITATE\n5. **SLEEP**\n\nThat's it - how we manage these MEECS affects not only how we feel, think, act, respond, remember, see - everything - but how well we can do any of these things.\n\n**But how do we know how much, and of what, when?** After all there are tons of ways to move, thousands of things to eat, numerous strategies around sleep, all sorts of ideas about thinking and many many ways to interact - it seems - with each other.\n\nFor example.\n\n- How do you know what to eat, when, to feel less stress or be sharp on a test or in a meeting?\n- How do you know how much movement you need in a day to remember stuff you learned today, tomorrow? better the next day?\n- You (and all of us) need quality in person social interaction to thrive - what does that \"quality\" feel like?\n- What part of our brain may need to cool down or amp up to help us solve problems that matter to us?\n- What ways can we stack or combine any of the MEECS to help us dance better, see more clearly, feel better about ourselves?\n\n**The XB app is your in hand laboratory - a virtual laboratory in a box - to test out scientifically supported approaches to build up your health knowledge skills and practices - easily.**\n\nWe call these \"experiments in a box\" - a box is usually 5 days long – with the weekend off.\n\nYou run the experiment; follow the protocol exactly for the week, record some data about your results - like you would with a lab book - and that's that.\n\nDAILY LOG- You are the laboratory scientist. Each day you are asked to run the experiment and record the results.\n\nTHIS BETA TEST VERSION OF THE XB APP: In this version of the XB app – we’re offering three labs in a box: one each for **Move, Eat and Sleep –** the are 4 experiments in each box. You can choose to do one, two or all three boxes together**.**\n\nA key question at the start of each day is “how do you feel?” better? worse? the same? All data is good data. If an experiment didn't lead to feeling better, then you have new data: that protocol doesn't work in this context; what might?\n\n**OUTCOME:** - **the goal of the XB is for YOU to be able to build up the knowldge skills and practices over the MEECS that you need to feel better, to thrive - without having to use an app.** That's right: this is an app to help you get off an app for owning your own health.\n\nFor example: an app approach to EAT might be food tracking with a calorie counter and a scale. The XB you'll encounter: using colour and connecting colour of a food with how you feel. No calorie counters or scales required - just your senses.\n",
                            type: 'markdown',
                        },
                    ],
                },
                {
                    contents: [
                        {
                            content:
                                '**Why have I been asked to participate?**\n\nYou have been invited to participate in this beta test as you have kindly expressed interest in using this approach to explore health, and you’ve suggested you’re interested in testing this software to offer feedback about using the app. You do NOT have to participate if you now wish to decline. No worries!\n\n**What will happen to me if I take part?**\n\nThat question is a little odd but it’s how our ethics approach works – so here’ the “what happens next”\n\nYou’ll be offered the opportunity to subscribe to as many of the three experiments in a box that we have Move, Eat and Sleep. Before you do so, you can also preview what each of these includes so you’re comfortable with the invitations.\n\nYOUR DAILY PRACTIVE INVITATIONS You’ll be invited to spend some time of your day engaging in tasks that are suggested by the app. Tasks range from simple “movement snacks” (short movements that take only a minute or so) to longer movement activities (such as walking for a period of time).\n\nYOUR LOGGING During the study, you will be guided to log some information about how each practice goes. We will not collect data specifically about your health, and ANY information we ask you to record is voluntary, so you won’t have to do, or answer, anything that you are uncomfortable with.\n\nXB BETA TEST TEAM: You may, if you choose, join the Study team on Microsoft Teams (email invitation to be sent to you for start of the study). There you will be able to ask questions, offer feedback, and join in once a week short Follow Up sessions to see how you’re doing and to Prep for the coming week.\n\nIf you choose to join the Team, your name will be visible to other participants and to the study investigators. We might use things that you post in the Team to improve the study app, or to further our understanding of the research topic. However, we will **not** link your activity in the Team to your wider participation, and we will not share any identifiable data from the Team with anybody who is not either a member of the Team itself or one of the investigators.\n\nWeekly Follow Up Email – You may also receive an email once a week with a link to a feedback form (anonymous) to share any experiences you’ve had with the app -or ideas about the app.\n\n**Are there any benefits in my taking part?**\n\nYour participation will help us understand how our experiment-in-a-box approach will impact the health tuning process. From previous versions of this study, based on participant reports, we expect that many participants will feel better and develop healthy Move Eat and Sleep practices as a result of taking part in the experiments.\n\n**Are there any risks involved?**\n\nThere are no significant risks associated with the current study beyond those which you might encounter in your day-to-day life. However, if at any point you feel uncomfortable please let the researchers know immediately.\n\n**What data will be collected?**\n\nBasically, we collect the digital log books: We will collect information through the app about the tasks that you take part in. WE will also have the information you provide as part of your account to be able to offer support for you if you encounter issues with the app.\n\n**Will my participation be confidential?**\n\n**Information that can be linked to you will be kept strictly confidential** (like your log in information that would show you agreed to take part in this study). You may choose to share with colleagues that you are taking part in this study – that’s fine and we certainly don’t record that.\n\nWe will create some anonymous datasets, **which cannot be linked back to you** or any specific individual, and will share those datasets as ‘open data’, available for anybody to analyse from any research we publish about this study.\n\n**Only members of the research team and responsible members of the University of Southampton may be given access to your personal data**. Personal data will be used only for research purposes of monitoring purposes (eg if you tell us you are filling in the lab book but we see nothing, we can check YOUR record to see if there’s a problem), and/or to carry out an audit of the study to ensure that the research is complying with applicable regulations (eg show our funders that the personal information is being processed as per these terms). Individuals from regulatory authorities (people who check that we are carrying out the study correctly) _may_ require access to your data. All of these people have a duty to keep your information, as a research participant, strictly confidential.\n\nAs far as possible, your data will be kept secure**. We will not publish any datasets or findings that could be linked back to you**, or which disclose your identity or personal involvement in the study.\n\n**Do I have to take part?**\n\nNo, it is entirely up to you to decide whether or not to take part. If you decide you want to take part, you will need to sign a consent form to show you have agreed to take part.\n\nYour faculty or service, manager or colleagues cannot insist that you take part in this study; and you should not feel that you have to take part.\n\n**What happens if I change my mind?**\n\nYou have the right to change your mind and withdraw at any time without giving a reason and without your participant rights being affected. Just email us at [xb24fallwithdrawl@nopain2.org](mailto:xb24fallwithdrawl@nopain2.org) with your account email and we’ll withdraw you from the study.\n\n**What will happen to the results of the research?**\n\nYour personal details will remain strictly confidential. Research findings made available in any reports or publications will not include information that can directly identify you without your specific consent.\n\nThe results of the study will be used in writing up a research paper, may be included in publications, and may also be used to inform related studies.\n\n**Where can I get more information?**\n\nIf you have any further questions regarding the study, please email Prof m.c. schraefel – <mc-xb24@nopain2.org>\n\n**What happens if there is a problem?**\n\nIf you have a concern about any aspect of this study, you should speak to the researchers who will do their best to answer your questions.\n\nIf you remain unhappy or have a complaint about any aspect of this study, please contact the University of Southampton Research Integrity and Governance Manager (023 8059 5058)\n',
                            type: 'markdown',
                        },
                    ],
                    title: 'About your participation: this is the Participant Information Sheet',
                    type: 'expandable',
                },
                {
                    content:
                        '**University of Southampton’s Data Protection Privacy Notice**\n\nThe University of Southampton conducts research to the highest standards of research integrity. As a publicly-funded organisation, the University has to ensure that it is in the public interest when we use personally-identifiable information about people who have agreed to take part in research. This means that when you agree to take part in a research study, we will use information about you in the ways needed, and for the purposes specified, to conduct and complete the research project. Under data protection law, ‘Personal data’ means any information that relates to and is capable of identifying a living individual. The University’s data protection policy governing the use of personal data by the University can be found on its website.\n',
                    type: 'markdown',
                },
                {
                    contents: [
                        {
                            content:
                                'This Participant Information Sheet tells you what data will be collected for this project and whether this includes any personal data. Please ask the research team if you have any questions or are unclear what data is being collected about you.\n\nOur privacy notice for research participants provides more information on how the University of Southampton collects and uses your personal data when you take part in one of our research projects and can be found\n\nAny personal data we collect in this study will be used only for the purposes of carrying out our research and will be handled according to the University’s policies in line with data protection law. If any personal data is used from which you can be identified directly, it will not be disclosed to anyone else without your consent unless the University of Southampton is required by law to disclose it.\n\nData protection law requires us to have a valid legal reason (‘lawful basis’) to process and use your Personal data. The lawful basis for processing personal information in this research study is for the performance of a task carried out in the public interest. Personal data collected for research will not be used for any other purpose.\n\nFor the purposes of data protection law, the University of Southampton is the ‘Data Controller’ for this study, which means that we are responsible for looking after your information and using it properly. The University of Southampton will keep identifiable information about you for 1 year after the study has finished after which time any link between you and your information will be removed.\n\nTo safeguard your rights, we will use the minimum personal data necessary to achieve our research study objectives. Your data protection rights – such as to access, change, or transfer such information - may be limited, however, in order for the research output to be reliable and accurate. The University will not do anything with your personal data that you would not reasonably expect.\n\nIf you have any questions about how your personal data is used, or wish to exercise any of your rights, please consult the University’s data protection where you can make a request using our online form. If you need further assistance, please contact the University’s Data Protection Officer ().\n',
                            type: 'markdown',
                        },
                    ],
                    title: 'More info',
                    type: 'expandable',
                },
                {
                    content:
                        '**Thank you**\n\nThank you for taking the time to read the information sheet and considering taking part in the research.\n\nBy checking the following points, you agree to the above terms to participate in this pilot app test You can review these terms at any time\n\nTO CONFIRM:',
                    type: 'markdown',
                },
            ],
        };
    }
}

export default Study;
