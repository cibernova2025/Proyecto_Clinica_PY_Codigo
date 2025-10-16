import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Patient } from './pages/patient/patient';
import { Results } from './pages/results/results';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'patient', component: Patient },
    { path: 'results', component: Results },
    { path: '**', redirectTo: '' }
];
