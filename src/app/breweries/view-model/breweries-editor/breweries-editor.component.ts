import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormBuilder,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
    Validators
} from '@angular/forms';
import {Breweries} from '../../breweries.model';

@Component({
    selector: 'app-breweries-editor',
    templateUrl: './breweries-editor.component.html',
    styleUrls: ['./breweries-editor.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BreweriesEditorComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => BreweriesEditorComponent),
            multi: true
        }
    ]
})
export class BreweriesEditorComponent implements OnInit, ControlValueAccessor, Validator {
    form: FormGroup = null;
    @Input() public item: Breweries;

    constructor(protected formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            id: new FormControl(''),
            name: new FormControl('', [Validators.required]),
            breweryType: new FormControl('', [Validators.required]),
            street: new FormControl('', [Validators.required]),
            address2: new FormControl('', [Validators.required]),
            address3: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required]),
            state: new FormControl('', [Validators.required]),
            countyProvince: new FormControl('', [Validators.required]),
            postalCode: new FormControl('', [Validators.required]),
            country: new FormControl('', [Validators.required]),
            longitude: new FormControl('', [Validators.required]),
            latitude: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required]),
            websiteUrl: new FormControl('', [Validators.required]),
            updatedAt: new FormControl('', [Validators.required]),
            createdAt: new FormControl('', [Validators.required]),});
        this.form.setValue(this.item);
    }

    writeValue(val: any) {
        if (val) {
            this.form.setValue(val, {emitEvent: false});
        }
    }

    registerOnChange(fn: any) {
        this.form.valueChanges.subscribe(fn);
    }

    registerOnTouched(fn: any) {
    }

    setDisabledState?(isDisabled: boolean): void {
        isDisabled ? this.form.disable() : this.form.enable();
    }

    validate(c: AbstractControl): ValidationErrors | null {
        return this.form.valid ? null : {invalidForm: {valid: false, message: 'Campos do formulário estão inválidos!'}};
    }
}
