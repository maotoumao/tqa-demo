import BrowseMode from './pages/browse-mode.vue';
import QaMode from './pages/qa-mode.vue';

const routers = [
    {
        path: '/browse',
        name: 'browse',
        component: BrowseMode,
    },
    {
        path: '/qa',
        name: 'qa',
        component: QaMode
    },
    {
        path: '/',
        redirect: '/browse'
    }
];

export default routers;
