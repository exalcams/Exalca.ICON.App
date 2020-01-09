import { NgModule, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
    MatFormFieldModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule
} from '@angular/material';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FuseCountdownModule, FuseHighlightModule, FuseMaterialColorPickerModule, FuseWidgetModule } from '@fuse/components';

import { FuseSharedModule } from '@fuse/shared.module';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AssetManagementComponent } from './asset-management/asset-management.component';
import { BoatassemplyComponent } from './boatassemply/boatassemply.component';
import { SourcedefinationComponent } from './sourcedefination/sourcedefination.component';
import { TransformComponent } from './transform/transform.component';
import { AdopterComponent } from './adopter/adopter.component';

const routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: 'asset-management',
        component: AssetManagementComponent
    },
    {
        path:'botassembly',
        component:BoatassemplyComponent
    },
    {
        path:'sourcedfination',
        component:SourcedefinationComponent
    },
    {
        path:'transform',
        component:TransformComponent
    },
    {
        path:'adopter',
        component:AdopterComponent
    },
    {
        path: '**',
        redirectTo: '/auth/login'
    }
    
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        // HttpClientModule,
        // TranslateModule,
        MatFormFieldModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,

        NgxChartsModule,

        FuseSharedModule,

        FuseCountdownModule,
        FuseHighlightModule,
        FuseMaterialColorPickerModule,
        FuseWidgetModule,

        FormsModule
    ],
    declarations: [DashboardComponent, AssetManagementComponent, BoatassemplyComponent, SourcedefinationComponent, TransformComponent, AdopterComponent],
    providers: [],
    entryComponents: []
})
export class PagesModule {}
