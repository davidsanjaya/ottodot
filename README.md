# Ottodot Booking System

A simple trial class booking system built with Next.js, Prisma, and SQLite.

## Overview

This project implements a booking system for trial classes where parents can register children into available classes.

The system enforces several business rules:

1. A student cannot book the same class twice.
2. A parent cannot book multiple children into the same class.
3. A class cannot exceed its capacity.
4. Bookings require payment confirmation.
5. Booking creation uses database transactions to reduce race-condition risks.

---

## Tech Stack

- Next.js 15
- TypeScript
- Prisma ORM
- SQLite

---

## Database Schema

### Parent

Represents a parent account.

| Field | Type   |
| ----- | ------ |
| id    | Int    |
| name  | String |

### Student

Represents a child belonging to a parent.

| Field    | Type   |
| -------- | ------ |
| id       | Int    |
| name     | String |
| parentId | Int    |

### TrialClass

Represents a trial class.

| Field    | Type   |
| -------- | ------ |
| id       | Int    |
| name     | String |
| capacity | Int    |

### Booking

Represents a class reservation.

| Field     | Type          |
| --------- | ------------- |
| id        | Int           |
| studentId | Int           |
| classId   | Int           |
| status    | BookingStatus |

### PaymentAttempt

Stores simulated payment attempts.

| Field     | Type    |
| --------- | ------- |
| id        | Int     |
| bookingId | Int     |
| success   | Boolean |

---

## Booking Status

```ts
enum BookingStatus {
  PENDING_PAYMENT
  CONFIRMED
  PAYMENT_FAILED
  CANCELLED
}
```

---

## Business Rules

### Rule 1

A student cannot book the same class twice.

Example:

```
Alice -> Saturday Trial Class
Alice -> Saturday Trial Class ❌
```

Returns:

```json
{
  "error": "Student already booked this class"
}
```

---

### Rule 2

A parent cannot register multiple children into the same class.

Example:

```
John Doe
 ├─ Alice
 └─ Bob

Alice -> Saturday Trial Class ✅
Bob -> Saturday Trial Class ❌
```

Returns:

```json
{
  "error": "Parent already has a child booked into this class"
}
```

---

### Rule 3

Class capacity cannot be exceeded.

Example:

```
Capacity = 4

Booking #1 ✅
Booking #2 ✅
Booking #3 ✅
Booking #4 ✅
Booking #5 ❌
```

Returns:

```json
{
  "error": "Class is full"
}
```

---

### Rule 4

Payment Confirmation

Bookings are initially created with:

```json
{
  "status": "PENDING_PAYMENT"
}
```

After payment simulation:

```json
{
  "status": "CONFIRMED"
}
```

or

```json
{
  "status": "PAYMENT_FAILED"
}
```

---

## API Endpoints

### Create Booking

POST

```
/api/bookings
```

Request

```json
{
  "studentId": 9,
  "classId": 5
}
```

---

### Simulate Payment

POST

```
/api/bookings/{id}/pay
```

Request

```json
{
  "success": true
}
```

---

### View Class Bookings

GET

```
/api/classes/{id}/bookings
```

Response

```json
{
  "id": 5,
  "name": "Saturday Trial Class",
  "capacity": 4,
  "totalBookings": 4,
  "remainingSeats": 0
}
```

---

## Running Locally

Install dependencies

```bash
npm install
```

Run migrations

```bash
npx prisma migrate deploy
```

Generate Prisma Client

```bash
npx prisma generate
```

Seed database

```bash
npm run seed
```

Start development server

```bash
npm run dev
```

---

## Race Condition Handling

Booking creation is wrapped inside a Prisma transaction.

This ensures that:

- Capacity checks
- Duplicate booking checks
- Parent booking checks
- Booking creation

are executed as a single database operation.

Although SQLite has limitations for true concurrent writes, the transaction structure is designed to be easily migrated to PostgreSQL or MySQL.

---

## Assumptions

- One student can only attend a class once.
- One parent may only have one child in a given class.
- Capacity includes pending and confirmed bookings.
- Payment processing is simulated.

---

## Future Improvements

- Authentication
- Real payment gateway integration
- Booking cancellation endpoint
- Admin dashboard
- Waitlist support
- PostgreSQL deployment
- Automated tests

## Time Spent

Approximately 4 hours.

Focus was placed on:

- Correct business rule enforcement
- Data integrity
- API design
- Transaction safety
