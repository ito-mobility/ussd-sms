module.exports = [
    {
        'en-ke': 'Join One Acre Fund',
        'sw': 'Jiunge na One Acre Fund',
        'option_name': 'find_oaf_contact',
        'end_date': project.vars.end_find_oaf_contact,
        'start_date': project.vars.start_find_oaf_contact
    },
    {
        'en-ke': 'View Farming Trainings',
        'sw': 'Pata Mafunzo',
        'option_name': 'trainings',
        'end_date': project.vars.end_training_non_client,
        'start_date': project.vars.start_training_non_client
    },
    {
        'en-ke': 'Find OAF Duka',
        'sw': 'Pata Duka la OAF',
        'option_name': 'locate_oaf_duka',
        'end_date': project.vars.end_locate_duka,
        'start_date': project.vars.start_locate_duka
    },
    {
        'en-ke': 'Report Seed Germination Issue',
        'sw': 'Ripoti shida ya kumea kwa mbegu',
        'option_name': 'report_seed_quality',
        'start_date': service.vars.start_report_seed_quality || project.vars[service.vars.seedQualityIssuesStart],
        'end_date': service.vars.end_report_seed_quality || project.vars[service.vars.seedQualityIssuesEnd]
    },
    {
        'en-ke': 'Customer Support',
        'sw': 'Wasiliana na Huduma ya wateja',
        'option_name': 'contact_call_center',
        'end_date': project.vars.end_contact_call_center,
        'start_date': project.vars.start_contact_call_center
    },
    {
        'en-ke': 'SBCC',
        'sw': 'SBCC',
        'option_name': 'sbcc',
        'end_date': project.vars.end_sbcc,
        'start_date': project.vars.start_sbcc
    },
    {
        'en-ke': 'Forgot account number',
        'sw': 'Nimesahau nambari yangu ya akaunti',
        'option_name': 'forgot_account_number',
        'end_date': project.vars.end_find_oaf_contact,
        'start_date': project.vars.start_find_oaf_contact
    },
];