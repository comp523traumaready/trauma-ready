const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Hospital = mongoose.model('Hospital');

router.get('/', (req, res) => {
  res.render('hospital/addOrEdit', {
    viewTitle : "Add Hospital"
  });
});

router.post('/', (req, res) => {
  if (req.body._id == '') {
    insertRecord(req, res);
  } else {
    updateRecord(req, res);
  }
});

function insertRecord(req, res) {
  var hospital = new Hospital();
  hospital.hospitalName = req.body.hospitalName;
  hospital.email = req.body.email;
  hospital.phoneDirectory = req.body.phone;
  hospital.rac = req.body.traumaRegion;
  hospital.address = req.body.address;
  hospital.traumaLevel = req.body.traumaLevel;
  hospital.save((err, doc) => {
    if (!err) {
      res.redirect('hospital/list');
    } else {
      if (err.name == 'ValidationError') {
        handleValidationError(err, req.body);
        res.render('hospital/addOrEdit', {
          viewTitle : "Add Hospital",
          hospital : req.body
        });
      } else {
        console.log(`Error during record insertion : ${err}`);
      }
    }
  });
}

function updateRecord(req, res) {
  Hospital.findOneAndUpdate({ _id: req.body._id}, req.body, {new: true}, (err, doc) => {
    if (!err) {
      res.redirect('hospital/list');
    } else {
      if (err.name == 'ValidationError') {
        handleValidationError(err, req.body);
        res.render("hospital/addOrEdit", {
          viewTitle: 'Update Hospital',
          hospital: req.body
        });
      } else {
        console.log(`Error during record update : ${err}`);
      }
    }
  });
}

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch(err.errors[field].path) {
      case 'hospitalName':
        body['hospitalNameError'] = err.errors[field].message;
        break;
      case 'email':
        body['emailError'] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
};

router.get('/list', (req, res) => {
  Hospital.find((err, docs) => {
    if (!err) {
      res.render('hospital/list', {
        list: docs
      });
    } else {
      console.log(`Error in retrieving hospital list : ${err}`);
    }
  });
});

router.get('/:id', (req, res) => {
  Hospital.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render('hospital/addOrEdit', {
        viewTitle: 'Update Hospital',
        hospital: doc
      });
    }
  });
});

router.get('/delete/:id', (req, res) => {
  Hospital.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect('/hospital/list');
    } else {
      console.log(`Error in hospital delete ${err}`);
    }
  });
});

module.exports = router;