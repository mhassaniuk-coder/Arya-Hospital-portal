export const MOCK_CLINICAL_NOTES = [
    {
        id: 'cn1',
        date: '2023-11-15',
        type: 'Consultation',
        doctorName: 'Dr. Emily Chen',
        specialty: 'Cardiology',
        summary: 'Patient presented with mild palpitations. ECG performed in office showed sinus rhythm with occasional PVCs. Reassured patient. advised to reduce caffeine intake.',
        fileUrl: '#'
    },
    {
        id: 'cn2',
        date: '2023-08-10',
        type: 'Discharge Summary',
        doctorName: 'Dr. Sarah Johnson',
        specialty: 'Internal Medicine',
        summary: 'Admitted for observation of severe allergic reaction. Treated with IV steroids and antihistamines. Symptoms resolved. Discharged stable.',
        fileUrl: '#'
    }
];

export const MOCK_VACCINATIONS = [
    {
        id: 'v1',
        vaccineName: 'Influenza (Flu)',
        dateGiven: '2023-09-20',
        status: 'Completed',
        provider: 'CVS Pharmacy'
    },
    {
        id: 'v2',
        vaccineName: 'COVID-19 Booster (Pfizer)',
        dateGiven: '2023-01-15',
        status: 'Completed',
        provider: 'City Health Clinic'
    },
    {
        id: 'v3',
        vaccineName: 'Tetanus, Diphtheria, Pertussis (Tdap)',
        dateGiven: '2019-05-10',
        dueDate: '2029-05-10',
        status: 'Completed',
        provider: 'Dr. James Wilson'
    }
];

export const MOCK_IMAGING_REPORTS = [
    {
        id: 'img1',
        modality: 'X-Ray',
        bodyPart: 'Chest',
        date: '2023-11-15',
        status: 'Normal',
        imageUrl: 'https://prod-images-static.radiopaedia.org/images/52671077/82436e05ad958897594957f86f8ce969_jumbo.jpeg',
        radiologist: 'Dr. Alan Grant',
        findings: 'Clear lung fields. No cardiomegaly. No pleural effusion or pneumothorax.'
    },
    {
        id: 'img2',
        modality: 'MRI',
        bodyPart: 'Right Knee',
        date: '2022-04-12',
        status: 'Abnormal',
        imageUrl: 'https://prod-images-static.radiopaedia.org/images/53936648/1d4036136efd74a22ad398604753f7f1_jumbo.jpeg',
        radiologist: 'Dr. Ellie Sattler',
        findings: 'Mild tear of the medial meniscus. Anterior/Posterior cruciate ligaments intact.'
    }
];
