module.exports = [
    {
        'en-ke': 'Make a payment',
        'sw': 'Fanya malipo',
        'option_name': 'make_payment',
        'end_date': project.vars.end_make_payment,
        'start_date': project.vars.start_make_payment
    },
    {
        'en-ke': 'Check balance',
        'sw': 'Kuangalia salio',
        'option_name': 'check_balance',
        'end_date': project.vars.end_check_balance,
        'start_date': project.vars.start_check_balance
    },
    {
        'en-ke': 'Register client',
        'sw': 'Sajili Mkulima',
        'option_name': 'register_client',
        'end_date': project.vars.end_register_client,
        'start_date': project.vars.start_register_client
    },
    {
        'en-ke': 'JiT enrollment',
        'sw': 'Sajili Mkulima wa JiT',
        'option_name': 'register_enroll_client',
        'end_date': project.vars[service.vars.registerEnrollEnd],
        'start_date': project.vars[service.vars.registerEnrollStart]
    },{
        'en-ke': 'JiT Top up',
        'sw': 'Ongeza Bibhaa za JiT',
        'option_name': 'top_up',
        'end_date': project.vars[service.vars.topUpEnd],
        'start_date': project.vars[service.vars.topUpStart]

    },
    {
        'en-ke': 'Training',
        'sw': 'Mafunzo',
        'option_name': 'trainings',
        'end_date': project.vars.end_training_client,
        'start_date': project.vars.start_training_client
    },
    {
        'en-ke': 'View transaction history',
        'sw': 'Angalia historia ya malipo',
        'option_name': 'transaction_history',
        'end_date': project.vars.end_tx_history,
        'start_date': project.vars.start_tx_history
    },
    {
        'en-ke': 'Prepayment amount',
        'sw': 'Malipo ya kufuzu',
        'option_name': 'prepayment_amount',
        'end_date': project.vars.end_prepayment_amount,
        'start_date': project.vars.start_prepayment_amount
    },
    {
        'en-ke': 'FAW Pesticide Order',
        'sw': 'Kuagiza dawa ya FAW',
        'option_name': 'presticide_order',
        'end_date': project.vars.end_FAW_order,
        'start_date': project.vars.start_FAW_order
    },
    {
        'en-ke': 'Solar',
        'sw': 'Sola',
        'option_name': 'solar',
        'end_date': project.vars.end_solar,
        'start_date': project.vars.start_solar
    },
    {
        'en-ke': 'Insurance',
        'sw': 'Bima',
        'option_name': 'insurance',
        'end_date': project.vars.end_insurance,
        'start_date': project.vars.start_insurance
    },
    {
        'en-ke': 'Contact Call center',
        'sw': 'Wasiliana na Huduma ya wateja',
        'option_name': 'contact_call_center',
        'end_date': project.vars.end_contact_call_center,
        'start_date': project.vars.start_contact_call_center
    },
    {
        'en-ke': 'Locate an OAF duka',
        'sw': 'Lipate duka la OAF',
        'option_name': 'locate_oaf_duka',
        'end_date': project.vars.end_locate_oaf_duka,
        'start_date': project.vars.start_locate_oaf_duka
    },
    {
        'en-ke': 'View group repayment',
        'sw': 'Mukhtasari wa malipo ya kikundi',
        'option_name': 'view_group_repayment',
        'end_date': project.vars.end_view_group_repayment,
        'start_date': project.vars.start_view_group_repayment
    },
    {
        'en-ke': 'Maize Recommendations',
        'sw': 'Ushauri wa aina ya mahindi',
        'option_name': 'maize_recommendation',
        'end_date': project.vars.end_maize_recommendation,
        'start_date': project.vars.start_maize_recommendation
    },
    {
        'en-ke': 'Check SHS warranty expiration',
        'sw': 'Tarehe ya mwisho ya warranty',
        'option_name': 'warranty_expiration',
        'end_date': project.vars.end_warranty_expiration,
        'start_date': project.vars.start_warranty_expiration
    },
    {
        'en-ke': 'Report Seed Quality Issue',
        'sw': 'Ripoti suala la ubora wa mbegu',
        'option_name': 'report_seed_quality',
        'start_date': service.vars.start_report_seed_quality || project.vars[service.vars.seedQualityIssuesStart],
        'end_date': service.vars.end_report_seed_quality || project.vars[service.vars.seedQualityIssuesEnd]
    },
    {
        'option_name': 'fo_details',
        'en-ke': 'FO Details',
        'sw': 'Maelezo ya Afisa wa nyanjan',
        'end_date': project.vars.end_fo_details,
        'start_date': project.vars.start_fo_details
    }
];
