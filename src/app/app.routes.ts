import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { History } from './pages/history/history';
import { Results } from './pages/results/results';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'history', component: History },
    { path: 'results', component: Results },
    { path: '**', redirectTo: '' }
];
