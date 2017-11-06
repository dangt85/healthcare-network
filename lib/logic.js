/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * A Member grants access to their record to another Member.
 * @param {org.acme.healthcare.AuthorizeAccess} authorize - the authorize to be processed
 * @transaction
 */
function authorizeAccess(authorize) {

    console.log('**** AUTH: ' + authorize.userId + ' access to ' + authorize.patientRecordId);

    var _insurerRegistry;

    return getParticipantRegistry('org.acme.healthcare.Insurer')
        .then(function(insurerRegistry) {
            _insurerRegistry = insurerRegistry;
            return insurerRegistry.get(authorize.userId);
        })
        .then(function(insurer) {
            // if the member is not already authorized, we authorize them
            var index = -1;

            if(!insurer.authorized) {
                insurer.authorized = [];
            } else {
                index = insurer.authorized.indexOf(authorize.patientRecordId);
            }

            if(index < 0) {
                insurer.authorized.push(authorize.patientRecordId);

                // emit an event
                var event = getFactory().newEvent('org.acme.healthcare', 'PatientEvent');
                event.patientTransaction = authorize;
                emit(event);

                return _insurerRegistry.update(insurer);
            }
        });
}

/**
 * A Member revokes access to their record from another Member.
 * @param {org.acme.healthcare.RevokeAccess} revoke - the RevokeAccess to be processed
 * @transaction
 */
function revokeAccess(revoke) {

    console.log('**** REVOKE: ' + revoke.userId + ' access to ' + revoke.patientRecordId);
    
    var _insurerRegistry;

    return getParticipantRegistry('org.acme.healthcare.Insurer')
        .then(function(insurerRegistry) {
            _insurerRegistry = insurerRegistry;
            return insurerRegistry.get(revoke.userId);
        })
        .then(function(insurer) {
            // if the member is authorized, we remove them
            var index = insurer.authorized ? insurer.authorized.indexOf(revoke.patientRecordId) : -1;

            if(index >= 0) {
                insurer.authorized.splice(index, 1);

                // emit an event
                var event = getFactory().newEvent('org.acme.healthcare', 'PatientEvent');
                event.patientTransaction = revoke;
                emit(event);

                return _insurerRegistry.update(insurer);
            }
        });
}