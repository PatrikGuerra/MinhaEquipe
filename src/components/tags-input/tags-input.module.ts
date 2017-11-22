import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TagsInputComponent } from './tags-input.component';
// import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';

//https://github.com/sub5111/ionic2-tags-input
@NgModule({
    declarations: [
        TagsInputComponent
    ],
    exports:[
        TagsInputComponent
    ],
    imports: [
        // BrowserModule,
        IonicModule
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class TagsInputModule { }