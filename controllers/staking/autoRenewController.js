const models = require('../../models');
const datefns = require("date-fns");

async function run_auto_renew_stake()
{
    setInterval(async function run(){
        console.log("auto_renew_stake");
        const user = await models.user.findAll({where : {
            isHolder : true
        }});
        user.forEach(async (u) => {
            const uuid = u.uuid;
            const stakeholderResquest = await models.stakeholder.findAll({where : {
                user_uuid : uuid
            }});
            stakeholderResquest.forEach(async (stakeholder) => {
                if(stakeholder.auto_renew == true && stakeholder.end_status == true)
                {
                    const amount_invest = stakeholder.amount_invest;
                    const period = stakeholder.period;
                    const rate = stakeholder.rate
                    const start_time = new Date();
                    const end_time = datefns.addDays(start_time,period);
                    const amount_reward = stakeholder.amount_reward;
                    const new_amount_reward = (amount_invest + amount_reward)*rate;
                    const amount_reward_day = stakeholder.amount_reward_day;
                    const new_amount_reward_day = amount_reward_day/period;
        
                    const stake = {
                        start_time : start_time,
                        end_time : end_time,
                        amount_reward : new_amount_reward,
                        amount_reward_day : new_amount_reward_day,
                    }
                    models.stakeholder.update(stake,{where : {
                        id : stakeholder.id,
                        user_uuid : uuid
                    }});
                    models.user.update({isHolder : true},{where : {
                        uuid : uuid
                    }})
                }
            })
            
        });
    },500)
}

module.exports = {
    run_auto_renew_stake : run_auto_renew_stake
}