const data = {
    "title": "Pre Exercise Questionnaire",
    "questions": [
        {
            "id": "1",
            "question": "Have you ever been exposed to a flood event in your living area?",
            "choices": ["Never", "Just rainfalls and normal runoffs", "Yes, but not extreme floods", "Yes, extreme floods"]
        },
        {
            "id": "2",
            "question": "To what degree have you ever suffered from a disaster impact caused by flooding?",
            "choices": ["None", "Low", "Medium", "High"]
        },
        {
            "id": "3",
            "question": "Are you aware of how flood-prone the area that you live in is?",
            "choices": ["Not at all", "Have heard somethings, but not sure about accuracy ", "Yes, there is no considerable flood risk ", "Yes, there is considerable flood risk"]
        },
        {
            "id": "4",
            "question": "How mentally prepared do you feel about facing an extreme flood event? (e.g.making proper decisions, controlling your panic and stress levels, etc.) ",
            "choices": ["Unprepared", "Mostly unprepared", "Mostly prepared", "Well prepared"]
        },
        {
            "id": "5",
            "question": "Have you ever been trained or educated on flood risk awareness and protective measures?",
            "choices": ["No", "Yes"],
            "detail": "yes",
            "detailText": "Please Specify"
        },
        {
            "id": "6",
            "question": "Do you trust the flood risk information provided to you by public institutions (e.g.various levels of government or government agencies)?",
            "choices": ["Not at all", "Mostly no", "Mostly yes", "Yes, completely"]
        },
        {
            "id": "7",
            "question": "Which information sources have/would you use to obtain information about flooding in your area?(Select all that apply) ",
            "choices": ["Emergency mandates (via emergency manager, government, etc.)", "Social media", "Discussion with nearby residents", "Weather forecasts", "Other"],
            "detail": "yes",
            "detailText": "Please Specify",
            "multiple": "true"
        }
    ]
};

export default data;