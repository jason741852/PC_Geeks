import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { HomeComponent } from './components/home/home.component'
import { LoginComponent } from './components/authentication/login/login.component'
import { RegisterComponent } from './components/authentication/register/register.component'
import { PCPartComponent } from './components/pcpart/pcpart.component'
import { ReviewComponent } from './components/review/review.component'

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'pcpart/:id',
        component: PCPartComponent
    },
    {
        path:'reviews/:pcpartId/add-review',
        component: ReviewComponent
    }
]

export const appRoutingProviders: any[] = []
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes)
