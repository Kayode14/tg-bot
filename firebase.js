// firebase.js
const admin = require('firebase-admin');

const firebaseConfig = {
  type: "service_account",
  project_id: "ton-lea",
  private_key_id: "16b478c4e693d880a24d3922c5e2e30a96ad0559",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC8TUOHD39Hgq0S\napmBUA48oyiyMr8pLqpV0b9ZIi0zG5zDv8rRbp1bnnCCuqm2wU5jPI7I87TMDTKS\nCPSwswvApd4tLWP11jf4Hx0f7IjjgM6cNH+ttnCFolDqb1AiJPzRrZZ9Gd4M43/L\naSMmrESeMMEGglPY7UXWtep/Iku0hDbt74fbUwrhZIjaCenPUO3KuKBxgFLGauVc\nYhMIgAioqb2GwU19/x02SSEY/NiVqm7lTslIK+mC9J0DQrBa/9ypTYvqYsd2+Kiu\n+VjrplKrR6+cXWjLemTgu4bwDAtBmddR4OwTj8ese7RSxJSO5kb4yvRBPo/wp6qr\njcdgQxzLAgMBAAECggEAHq5+NscNJ6NAvRP2gC4Bq9qv+l0vba/nXEVpZsYdVEsG\n/5REIVzjMfb+gSaWGauksKHA6DhheLAb0dS4vgPmgdTk/zp6o6dshjbXoYiCg4NM\n5wHc3fqwme2pPpG1nmKleSrOLwMkfbgh7gxrCFWgdqAeC4f3zoxWyVXp6B439Kkg\nlE+INGtRm20PxM7QtvWZlzi3fRd0+dKYZAeFDuc2HfxUpfxqyzVoKtn8J/9HCsYg\nu+4kbPeScFwOMrWFHfbTQCPepHU0ZzZbJg7CGYyGykhJIw1URQlNmMuE9vKK9B4/\n3jLfvnQdYBOyXv4T/Z78brjCSawlRpZsTKyKTgUVXQKBgQDvLI3PIXmBgvhv+SyN\ntJVBzcmTDPl41G/VmOFO1uR4guT0ZDgdK3vqCnstho3IGIb5LmTmly69e+RoodJT\nqwHvEFLV9Y2kxWb9Zf6M03hPxHTiO93nZ+ZOra0aMbdSwqD++Z5ohhEC1GKOS7k4\nToh6bEdOTdLgCJTE1K/1gIljtQKBgQDJjISH1VjANtBr1Fk61bGym+Th7vl3cZ0I\nY40028/37HYmUuy1J+s/V+ly4hlbyb3P+RVK9ghMQu/gBhtkeq0rJm54uG9rcWLQ\n/0/HeOKqsjMzhP+WbcoVZ+1JjSModbzHskxSBAwMXTuZfap/CDWSA0kwWdk/MKL0\n6pCBj8POfwKBgCtoFJyA4MJmeJwpxrI5EdWNeYXclvIc6+cCBfH/Ahv09YR9I8n3\neFeza0OJ5fVoriZPCzTmPy9Yas2qgLd6k7FFbyMxm3FJ+jUG67m3L2CasPPWFaHH\ns36X+pCEcVbtx7Y+q0cg/blbvj9A8u6LIi3FtPM7IIhURluqlfyiRUz5AoGBAJxy\nJYGmmoCBS+EXcLfZnliM5+p0bFJJ72HOnJI2OcUxWDjBT5oCxXlizQPu+04jV+Iy\nb1PDjIddwgL72pFxJDAFYeT1DQ+ycMjYFV45uIBVWKcaCqcCy8U36ZmZI3xJf+Lm\nxJU5LPz/9b5cLFb00VhokowkghyprSQ9WzQmmxATAoGATOly6hyjiRYCXclc+yi2\nUpJQSGUl3R1iApqEvl0B/NrvLGDiTty385RL+JGTcxgWGaWdea665ML/vfmv8ydu\nLnLLJLqH5x6790RugRk9Jo/052e6T6m24oYgQx/643qnSsB6sG8IrlsKBEM2+QM1\nHbEQZFCFeq0+v/X3Stv5Xyo=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-lbwm1@ton-lea.iam.gserviceaccount.com",
  client_id: "115823212131955077414",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-lbwm1%40ton-lea.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://ton-lea.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;
