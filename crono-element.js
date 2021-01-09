/**
 * @license
 * Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

import { LitElement, html, css } from 'lit-element';
import '@kor-ui/kor/components/card';
import '@vaadin/vaadin-tabs'
import '@vaadin/vaadin-text-field'
import '@vaadin/vaadin-button'
import '@vaadin/vaadin-icons'

/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class CronoElement extends LitElement {
    static get properties() {
        return {
            name: { type: String },
            duration: { type: Number },

            type: { type: Number },

            timer: { type: Number },
            status: { type: Number },
            done: { type: Boolean },
            pomoCount: { type: Number },
            shotCount: { type: Number },
            longCount: { type: Number },
            pomoTime: { type: Number },
            shortTime: { type: Number },
            longTime: { type: Number },

            updatingName: { type: Boolean },
        };
    }

    constructor() {
        super();
        this.status = 0;
        this.done = false
        
        this.type = 0
        this.updatingName = false
        
        this.pomoCount = 0;
        this.shotCount = 0;
        this.longCount = 0;
        
        setInterval(() => {
            if (this.status == 1){
                this.timer -= 1;
                if (this.timer == 0) {
                    this._stop();
                }
            }
        }, 1000);
    }

    begin() {
        if (this.status == 0) {
            this.timer = this.pomoTime
        }
    }
    

    _start() {
        this.pomoCount++;
        this.status = 1;
    }

    _pause() {
        this.status = this.status == 1 ? 2 : 1;
    }

    _stop() {
        this.status = 1;
        if (this.type == 0) {
            if (this.pomoCount % 4 != 0) {
                this.shotCount++;
                this.type = 1;
                this.timer = this.shortTime;
            } else {
                this.longCount++;
                this.type = 2;
                this.timer = this.longTime;
            }
        } else if (this.type == 1) {
            if (this.pomoCount < this.duration) {
                this.pomoCount++;
                this.type = 0;
                this.timer = this.pomoTime;
            } else {
                this._done();
            }

        } else {
            if (this.pomoCount < this.duration) {
                this.pomoCount++;
                this.type = 0;
                this.timer = this.pomoTime;
            } else {
                this._done();
            }
        }
    }

    _done() {
        this.done = true;
        this.type = 0;
        this.status = 0;
        this.timer = this.pomoTime
        this.pomoCount = 0;
        this.shotCount = 0;
        this.longCount = 0;
        var event = new CustomEvent('timer-done', { detail: { stuff: "stuff" } });
        this.dispatchEvent(event);
    }

    _updateName(e) {
        this.updatingName = false;
        var event = new CustomEvent('update-name', { detail: { newName: e.srcElement.value } });
        this.dispatchEvent(event);
    }

    render() {
        this.begin();
        return html`
            <div>
            <kor-card style="margin:5%; text-align: center; background-color:${this.type==0 ? 
                "#db6c6c" : this.type==1 ? "#53bbb1" : "#e181ff"};">
                <vaadin-tabs  style="width: 100%; margin: 0; text-shadow: 1px black;
                font-family: 'Roboto', sans-serif;" selected="${this.type}">
                    <vaadin-tab ?disabled="${this.type != 0}" style="width: 33%;">
                        ${this.pomoCount}<br>Pomodoro
                    </vaadin-tab>
                    <vaadin-tab ?disabled="${this.type != 1}" @click='${this._doNothing}' style="width: 33%;">
                        ${this.shotCount}<br>Short Break
                    </vaadin-tab>
                    <vaadin-tab ?disabled="${this.type != 2}" @click='${this._doNothing}' style="width: 33%;">
                        ${this.longCount}<br>Long Break
                    </vaadin-tab>   
                </vaadin-tabs>
                <div style="margin: 10% 0% 10% 0; 
                color:#ffffff; font-size: 75px; 
                text-shadow: 1px 1px 5px black;
                font-family: 'Roboto', sans-serif;">
                    ${ ~~( ~~(this.timer/60) / 10) == 0 ? "0" : "" }${~~(this.timer/60)} : ${ ~~( ~~(this.timer%60) / 10) == 0 ? "0" : "" }${this.timer%60}
                </div>
                <div>
                ${ this.status == 0 ? 
                    html`<vaadin-button theme="contrast primary" style="width: 50%;" @click="${this._start}">Start</vaadin-button>`
                :
                    html`
                    <vaadin-button theme="contrast primary" style="width: 33%;" @click="${this._pause}">Pause</vaadin-button>
                    <vaadin-button theme="contrast primary" style="width: 33%;" @click="${this._stop}">Skip</vaadin-button>
                    `}
                </div>
                <div>
                    <vaadin-text-field 
                        class="timer-job-name"
                        id="activityName"
                        ?readonly='${!this.updatingName}'
                        style="width: 80%;" 
                        .value='${this.name}'
                        @blur="${this._updateName}"
                        @keyup='${this._enterHandler}'
                    ></vaadin-text-field>
                    <vaadin-button @click='${this._allowUpdate}'>
                        <iron-icon icon="vaadin:pencil"></iron-icon>
                    </vaadin-button>
                </div>
            </kor-card>
            </div>
        `;
    }

    _allowUpdate(e) {
        this.updatingName = true;
        let text = this.shadowRoot.getElementById('activityName');
        text.removeAttribute('readonly')
        text.focus();
    }

    _enterHandler(e) {
        let key = e.keyCode;
        if(key == 13) {
            let text = this.shadowRoot.getElementById('activityName');
            text.setAttribute('readonly', true)
            text.blur()
        }
    }

    _doNothing(e) {
        console.log("Sorry That's not allowed.")
    }
}

window.customElements.define('crono-element', CronoElement);
