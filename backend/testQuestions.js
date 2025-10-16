const testQuestions = {
    Depression: [
        {
            id: 1,
            question: "Over the past 2 weeks, how often have you felt little interest or pleasure in doing things?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 2,
            question: "Over the past 2 weeks, how often have you felt down, depressed, or hopeless?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 3,
            question: "Over the past 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 4,
            question: "Over the past 2 weeks, how often have you felt tired or had little energy?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 5,
            question: "Over the past 2 weeks, how often have you had poor appetite or been overeating?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 6,
            question: "Over the past 2 weeks, how often have you felt bad about yourself, or felt like a failure?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 7,
            question: "Over the past 2 weeks, how often have you had trouble concentrating on things like reading or watching TV?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 8,
            question: "Over the past 2 weeks, how often have you been moving or speaking more slowly than usual, or been overly restless?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 9,
            question: "Over the past 2 weeks, how often have you had thoughts that you would be better off dead or of hurting yourself?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        }
        
    ],
    Anxiety: [
        {
            id: 1,
            question: "Over the past 2 weeks, how often have you felt nervous, anxious, or on edge?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 2,
            question: "Over the past 2 weeks, how often have you not been able to stop or control worrying?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 3,
            question: "Over the past 2 weeks, how often have you had trouble relaxing?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 4,
            question: "Over the past 2 weeks, how often have you felt worried too much about different things?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 5,
            question: "Over the past 2 weeks, how often have you felt so restless that it was hard to sit still?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 6,
            question: "Over the past 2 weeks, how often have you become easily annoyed or irritable?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        },
        {
            id: 7,
            question: "Over the past 2 weeks, how often have you felt afraid that something awful might happen?",
            options: ["Not at all", "Several days", "More than half the days", "Nearly every day"]
        }
    ],
    ADHD: [
        {
            id: 1,
            question: "How often do you have trouble wrapping up the final details of a project once the challenging parts have been done?",
            options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
        },
        {
            id: 2,
            question: "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
            options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
        },
        {
            id: 3,
            question: "How often do you have problems remembering appointments or obligations?",
            options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
        },
        {
            id: 4,
            question: "Over the past 6 months, how often have you felt the need to fidget or tap your hands or feet when seated?",
            options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
        },
        {
            id: 5,
            question: "Over the past 6 months, how often have you felt overly active or compelled to be constantly doing something?",
            options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
        },
        {
            id: 6,
            question: "Over the past 6 months, how often have you been easily distracted by surroundings or thoughts?",
            options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
        },
        {
            id: 7,
            question: "Over the past 6 months, how often have you avoided or delayed starting tasks that require mental effort?",
            options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
        },
        {
            id: 8,
            question: "Over the past 6 months, how often have you made careless mistakes in your work or other activities?",
            options: ["Never", "Rarely", "Sometimes", "Often", "Very Often"]
        },
       
        
    ],
    OCD: [
        {
            id: 1,
            question: "Over the past week, how often have you experienced unwanted thoughts, images, or impulses that were hard to control?",
            options: ["0-1 hours", "1-3 hours", "3-8 hours", "8+ hours"]
        },
        {
            id: 2,
            question: "Over the past week, how often have you spent significant time each day focused on obsessive thoughts?",
            options: ["Not at all", "Slightly", "Moderately", "Severely"]
        },
        {
            id: 3,
            question: "Over the past week, how often have you felt distressed or anxious because of these thoughts?",
            options: ["Complete control", "Much control", "Some control", "No control"]
        },
        {
            id: 4,
            question: "Over the past week, how often have you performed repetitive behaviors like checking, washing, or counting?",
            options: ["Not at all", "Slightly", "Moderately", "Severely"]
        },
        {
            id: 5,
            question: "Over the past week, how often have you spent a large portion of your day doing compulsive behaviors?",
            options: ["Not at all", "Slightly", "Moderately", "Severely"]
        },
        {
            id: 6,
            question: "Over the past week, how often have you felt unable to stop or resist your compulsions?",
            options: ["Not at all", "Slightly", "Moderately", "Severely"]
        },
        {
            id: 7,
            question: "Over the past week, how often have these compulsions interfered with your daily responsibilities?",
            options: ["Not at all", "Slightly", "Moderately", "Severely"]
        },
        {
            id: 8,
            question: "Over the past week, how often have you felt anxious when trying to resist obsessive thoughts or behaviors?",
            options: ["Not at all", "Slightly", "Moderately", "Severely"]
        }
        
    ]
};

module.exports = testQuestions; 