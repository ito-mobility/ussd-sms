/*
    Script: ext-answer-verify.js
    Description: check if selected response is correct or not and return a feedback string
    Status: complete
*/

module.exports = function(response){
    // load in relevant tables
    var answesTable = state.vars.gus_active == '1' ? 'survey_answers_gus' : 'survey_answers';
    console.log('response table: ' + answesTable);
    var answer_table = project.getOrCreateDataTable(answesTable);
    var answer_row = answer_table.queryRows({'vars': {'question_id': state.vars.question_id}}).next();
    var correct_answer = answer_row.vars.correct_answer;
    var correct_opt = parseInt(answer_row.vars.correct_number);
    var numOptions = parseInt(answer_row.vars.numoptions);
    console.log('response is ' + response + ' ' + typeof(response));
    console.log('correct answer is ' + correct_opt + ' ' + typeof(correct_opt));

    // provide feedback if the response is correct or not
    var feedback;
    if(response === correct_opt){
        feedback = 'Ni byiza';
        state.vars.num_correct = state.vars.num_correct + 1;
        call.vars.num_correct = state.vars.num_correct;
    } 
    else if(response > numOptions){
        feedback = 'Si byo, ' + correct_answer + ' nicyo gisubizo';
    }
    else{
        feedback = correct_answer + ' nicyo gisubizo';
    }
    if(answesTable === 'survey_answers_gus') {
        feedback = '';
    }
    // save the session data and return the feedback
    return feedback;
};