# Healthcare PII Network

> A simple healthcare business network where physicians can grant/revoke access to patient's personal information to insurers.

This business network defines:

**Participants**
`Patient`
`Physician`
`Insurer`
`Relative`

**Transactions**
`AuthorizeAccess` `RevokeAccess`

To test this Business Network Definition in the **Test** tab:

1. Create a `Patient` participant:

```
{
  "$class": "org.acme.healthcare.Patient",
  "personId": "patientA@acme.org",
  "firstName": "Billy",
  "lastName": "Thompson"
}
```

2. Create a `Physician` participan:

```
{
  "$class": "org.acme.healthcare.Physician",
  "personId": "physicianB@acme.org",
  "firstName": "Jenny",
  "lastName": "Jones"
}
```

3. Create an `Insurer` participan:

```
{
  "$class": "org.acme.healthcare.Insurer",
  "personId": "insurerC@acme.org",
  "firstName": "Adam",
  "lastName": "Smith"
}
```

4. Create a `PatientRecord` asset:

```
{
  "$class": "org.acme.healthcare.PatientRecord",
  "recordId": "patientA-physicianB-00001",
  "timestamp": "2017-11-07T13:10:16Z",
  "notes": "1st year visit",
  "patient": "resource:org.acme.healthcare.Patient#patientA@acme.org",
  "physician": "resource:org.acme.healthcare.Physician#physicianB@acme.org"
}
```

Submit a `AuthorizeAccess` transaction:

```
{
  "$class": "org.acme.healthcare.AuthorizeAccess",
  "patientRecordId": "patientA-physicianB-00001",
  "userId": "insurerC@acme.org"
}
```

This `AuthorizeAccess` allowed `insurerC@acme.org` permission to view personal information of other members.

Submit a `RevokeAccess` transaction:

```
{
  "$class": "org.acme.healthcare.RevokeAccess",
  "patientRecordId": "patientA-physicianB-00001",
  "userId": "insurerC@acme.org"
}
```

This `RevokeAccess` revoked `insurerC@acme.org` permission to view personal information of other members.

Congratulations!
