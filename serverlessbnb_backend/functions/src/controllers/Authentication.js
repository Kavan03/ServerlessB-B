const router = require('express').Router()
const Strings = require('../utils/String')
const { getFirestore } = require('firebase-admin/firestore')

router.post('/addAnswers', async (req, res) => {
  const db = getFirestore()
  const { customerId, userName, questions, answers, cipherKey } = req.body

  try {
    const docRef = db.collection(Strings.COLLECTION_NAME).doc(userName)

    const userData = {
      questions: questions,
      customerId: customerId,
      answers: answers,
      cipherKey: cipherKey,
    }
    await docRef.set(userData)
    res
      .status(200)
      .send({ success: true, message: 'Successfully added answers' })
  } catch (error) {
    console.log('adding answer error==', error)
    res
      .status(400)
      .send({ success: false, message: 'Error adding answers to the database' })
  }
})

router.post('/getQuestions', async (req, res) => {
  const db = getFirestore()
  const { userName } = req.body

  try {
    const snapshot = await db
      .collection(Strings.COLLECTION_NAME)
      .doc(userName)
      .get()

    if (snapshot.exists) {
      const data = snapshot.data()
      const { questions: dbQuestions } = data

      if (dbQuestions.length > 0) {
        res.status(200).send({
          success: true,
          message: 'Successfully fetched question',
          question: dbQuestions,
        })
      } else {
        res
          .status(400)
          .send({ success: false, message: 'Error fetching questions' })
      }
    } else {
      res.status(400).send({ success: false, message: 'User does not exist' })
    }
  } catch (error) {
    console.log('fetching question error==', error)
    res
      .status(400)
      .send({ success: false, message: 'Error fetching questions' })
  }
})

router.post('/verifyAnswers', async (req, res) => {
  const db = getFirestore()
  const { userName, questions, answers } = req.body

  try {
    const snapshot = await db
      .collection(Strings.COLLECTION_NAME)
      .doc(userName)
      .get()

    if (snapshot.exists) {
      const data = snapshot.data()
      const { questions: dbQuestions, answers: dbAnswers } = data
      const getQuestionIndex = dbQuestions.findIndex(
        (question) => question === questions[0]
      )
      const getAnswerIndex = dbAnswers.findIndex(
        (answer) => answer === answers[0]
      )

      if (
        getQuestionIndex > -1 &&
        getAnswerIndex > -1 &&
        getQuestionIndex === getAnswerIndex
      ) {
        res
          .status(200)
          .send({ success: true, message: 'Successfully verified answers' })
      } else {
        res
          .status(400)
          .send({ success: false, message: 'Error verifying answers' })
      }
    } else {
      res.status(400).send({ success: false, message: 'User does not exist' })
    }
  } catch (error) {
    console.log('verify answer error==', error)
    res.status(400).send({ success: false, message: 'Error verifying answers' })
  }
})

router.post('/doDecryption', async (req, res) => {
  const { cipherText, plainText, userName } = req.body
  try {
    const db = getFirestore()
    const snapshot = await db
      .collection(Strings.COLLECTION_NAME)
      .doc(userName)
      .get()

    if (snapshot.exists) {
      const data = snapshot.data()
      const { cipherKey: key } = data

      let lowerAlphas = Strings.ALPHABET.toLowerCase().split('')
      let upperAlphas = Strings.ALPHABET.toUpperCase().split('')

      const decryptedCipher = cipherText
        .split('')
        .map((char) => {
          if (!lowerAlphas.includes(char) && !upperAlphas.includes(char)) {
            res
              .status(400)
              .send({ success: false, message: 'Error decypting text' })
          }

          let lcDecryptIndex =
            (lowerAlphas.indexOf(char.toLowerCase()) - key) % 26
          lcDecryptIndex =
            lcDecryptIndex < 0 ? lcDecryptIndex + 26 : lcDecryptIndex
          const lcDecryptedChar = lowerAlphas[lcDecryptIndex]

          let ucDecryptIndex =
            (upperAlphas.indexOf(char.toUpperCase()) - key) % 26
          ucDecryptIndex =
            ucDecryptIndex < 0 ? ucDecryptIndex + 26 : ucDecryptIndex
          const ucDecryptedChar = upperAlphas[ucDecryptIndex]

          return lowerAlphas.indexOf(char) !== -1
            ? lcDecryptedChar
            : ucDecryptedChar
        })
        .join('')

      if (plainText === decryptedCipher) {
        res
          .status(200)
          .send({ success: true, message: 'Authentication successful' })
      } else {
        res
          .status(400)
          .send({ success: false, message: 'Authentication failed' })
      }
    } else {
      res.status(400).send({ success: false, message: 'User does not exist' })
    }
  } catch (error) {
    console.log('ceaser cipher authentication error==', error)
    res.status(400).send({ success: false, message: 'Error in authentication' })
  }
})

module.exports = router
