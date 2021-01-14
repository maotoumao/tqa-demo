import Mock from 'mockjs';
import CONSTS from './consts';

Mock.setup({
    timeout: '200-800'
})

Mock.mock(`${CONSTS.MODEL_BASE}`, 'post', (req) => {
    // const {questionId} = JSON.parse(req.body);
    return {
        code: 200,
        cls_sent: 'blablabla',
        score: '[1 2 3 4 5 6]'
    }
})
