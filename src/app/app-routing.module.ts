import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LiverateComponent } from './components/liverate/liverate.component';


const routes:Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'rate', component: LiverateComponent},
  {path: 'rate/:duration', component: LiverateComponent},
  {path: 'home', component: HomeComponent},
  {path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
