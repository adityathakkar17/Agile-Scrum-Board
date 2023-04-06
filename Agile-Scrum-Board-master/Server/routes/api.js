const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const User = require('../models/user')
const JIssueModel = require('../models/issue')
const mongoose = require('mongoose')
const TeamMemberModel = require('../models/TeamMember')
const db = "mongodb+srv://harsh:Harsh123456@kanbanboard.vg71trr.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(db, err => {
  if (err) {
    console.error('Error!' + err)
  } else {
    console.log('Connetced to mongodb')
  }
})
router.get('/', (req, res) => {
  res.send('From API route')
})

function verifyToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if (token === 'null') {
    return res.status(401).send('Unauthorized request')
  }
  let payload = jwt.verify(token, 'secretKey')
  if (!payload) {
    return res.status(401).send('Unauthorized request')
  }
  req.userId = payload.subject
  next()
}

// router.post('/register', (req, res) => {
//   let userData = req.body
//   let user = new User(userData)
//   User.findOne({ email: userData.email }, (error, user) => {
//     if (error) {
//       console.log(error);
//       return;
//     }
//     else {
//       console.log('exists')
//       res.status(500).send('Email already exists');
//     }
//   })
//   user.save((error, registeredUser) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send('Internal server error');
//     }
//     else {
//       let payload = { subject: registeredUser._id }
//       let token = jwt.sign(payload, 'secretKey')
//       res.status(200).send({ token })
//     }
//   })
// })
router.post('/register', (req, res) => {
  let userData = req.body
  let user = new User(userData)

  User.findOne({ email: userData.email }, (error, existingUser) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
    else if (existingUser) {
      console.log('exists')
      res.status(400).send('Email already exists');
    }
    else {
      user.save((error, registeredUser) => {
        if (error) {
          console.log(error);
res.status(500).send('Internal server error');
        }
        else {
          let payload = {
            subject: registeredUser._id
          }
          const teammember = new TeamMemberModel({
            name:registeredUser.email,
            adminId: registeredUser._id
          });
          console.log(teammember);
          // save the issue to MongoDB
          teammember.save((error, savedMember) => {
            if (error) {
              console.log(error);
              res.status(500).send('Internal server error');
            }
            else {
              console.log('saved ');
              
            }
          });
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({ token })
        }
      })
    }
  })
})
router.post('/login', (req, res) => {
  let userData = req.body
  console.log(userData)
  User.findOne({ email: userData.email }, (error, user) => {
    if (error) {
      console.log(error)
    }
    else {
      if (!user) {
        res.status(401).send('Invalid Username')
      } else {
        if (user.password !== userData.password) {
          res.status(401).send('Invalid Password')
        } else {
          let payload = { subject: user._id }
          let token = jwt.sign(payload, 'secretKey')
          res.status(200).send({ 'token': token, 'userId': user._id })
        }
      }
    }
  })
})
router.get('/jissues/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const jissues = await JIssueModel.find({ createdBy: userId });
    // console.log(jissues);
    res.json(jissues);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
router.post('/saveIssues', verifyToken, async (req, res) => {
  console.log('save issue');
  issueData = req.body.issue;
  console.log(issueData);
  const issue = new JIssueModel({
    title: issueData.title,
    type: issueData.type,
    status: issueData.status,
    priority: issueData.priority,
    listPosition: issueData.listPosition,
    description: issueData.description,
    estimate: issueData.estimate,
    timeSpent: issueData.timeSpent,
    timeRemaining: issueData.timeRemaining,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reporterId: issueData.reporterId,
    userIds: issueData.userIds,
    createdBy: req.body.userId
  });
  console.log(issue);
  // save the issue to MongoDB
  issue.save((error, savedIssue) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
    else {
      console.log('saved ');
      res.status(200).send(savedIssue)
    }
  });
});
router.post('/updateIssue', verifyToken, async (req, res) => {
  console.log('save issue');
  issueData = req.body.issue;
  console.log(issueData);
  const issue = {
    title: issueData.title,
    type: issueData.type,
    status: issueData.status,
    priority: issueData.priority,
    listPosition: issueData.listPosition,
    description: issueData.description,
    estimate: issueData.estimate,
    timeSpent: issueData.timeSpent,
    timeRemaining: issueData.timeRemaining,
    updatedAt: new Date().toISOString(),
    reporterId: issueData.reporterId,
    userIds: issueData.userIds
  };
  console.log(issue);
  // update the issue in MongoDB using the _id field
  JIssueModel.findByIdAndUpdate(issueData._id, issue, { new: true }, (error, updatedIssue) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    } else {
      console.log('updated');
      res.status(200).send(updatedIssue);
    }
  });
});
router.post('/updateIssueNew', verifyToken, async (req, res) => {
  try {
    const issueData = req.body.issue;
    const issueId = issueData._id;
    if (!issueData || !issueId) {
      res.status(400).send('Invalid request: missing issue or issueId field');
      return;
    }
    const updatedIssue = await JIssueModel.findByIdAndUpdate(issueId, {
      ...issueData,
      updatedAt: new Date().toISOString()
    }, { new: true });
    if (!updatedIssue) {
      res.status(404).send(`Issue not found with _id: ${issueId}`);
      return;
    }
    console.log('updated');
    res.status(200).send(updatedIssue);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});
router.delete('/deleteIssue/:issueId', verifyToken, async (req, res) => {
    try {
      const issue = await JIssueModel.findByIdAndDelete(req.params.issueId);
      if (!issue) {
        return res.status(404).send('Issue not found');
      }
      res.status(200).send(issue);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
});

router.get('/getTeamMember/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    const members = await TeamMemberModel.find({ adminId: userId });
    // console.log(jissues);
    res.json(members);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});
router.post('/saveTeamMember', verifyToken, async (req, res) => {
  console.log('save member');
  const teammember = new TeamMemberModel({
    name: req.body.member.name,
    adminId: req.body.userId
  });
  console.log(teammember);
  // save the issue to MongoDB
  teammember.save((error, savedMember) => {
    if (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
    else {
      console.log('saved ');
      res.status(200).send(savedMember)
    }
  });
});

router.delete('/deleteTeamMember/:memberId', verifyToken, async (req, res) => {
  try {
    const teamMember= await TeamMemberModel.findByIdAndDelete(req.params.memberId);
    if (!teamMember) {
      return res.status(404).send('Issue not found');
    }
    res.status(200).send(teamMember);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router