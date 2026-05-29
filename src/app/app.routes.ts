import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'fundamentals/sales-mindset', pathMatch: 'full' },
  {
    path: ':moduleId/:submoduleId',
    loadComponent: () => import('./features/lesson/lesson').then(m => m.LessonComponent)
  },
  { path: '**', redirectTo: 'fundamentals/sales-mindset' }
];
