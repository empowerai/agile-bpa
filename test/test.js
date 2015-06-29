


var should = require('chai').should(),
    supertest = require('supertest');
    
var config_app_url = process.env.NODE_APP_URL;
var config_app_port = process.env.NODE_APP_PORT;
var api = supertest(config_app_url+":"+config_app_port);

var crowd_count;
console.log("config_app_url:"+config_app_url);
console.log("config_app_port:"+config_app_port);

describe('NCI-BPA API Unit Testing', function(done) {
  it('testing SEARCH API with date', function(done) {
    api.get('/api/search.json?date=2015')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('results');
      done();
    });
  });
  it('testing SEARCH API with food', function(done) {
    api.get('/api/search.json?food=cheese')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('results');
      done();
    });
  });
  it('testing SEARCH API with state', function(done) {
    api.get('/api/search.json?state=VA')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('results');
      done();
    });
  });
  it('testing SEARCH API with status', function(done) {
    api.get('/api/search.json?stdatus=ongoing')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('results');
      done();
    });
  });
  it('testing SEARCH API with class', function(done) {
    api.get('/api/search.json?class=2')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      res.body.should.have.property('results');
      done();
    });
  });
  it('testing COUNNT API with date', function(done) {
    api.get('/api/count.json?count=date')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      var res = res.body;
      //res.status.should.have.property('status', 200);
      res.results.should.have.property('date_count');
      done();
    });
  });
  
  it('testing COUNNT API with status', function(done) {
    api.get('/api/count.json?count=status')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      var res = res.body;
      //res.status.should.have.property('status', 200);
      res.results.should.have.property('ongoing');
      res.results.should.have.property('terminated');
      res.results.should.have.property('completed');
      //res.body.should.have.property('results').and.be.instanceof(Array)
      
      done();
    });
  });

  it('testing COUNNT API with classfications', function(done) {
    api.get('/api/count.json?count=class')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      var res = res.body;
      //res.status.should.have.property('status', 200);
      res.results.should.have.property('class1');
      res.results.should.have.property('class2');
      res.results.should.have.property('class3');
      //res.body.should.have.property('results').and.be.instanceof(Array)
      
      done();
    });  
  });

  it('testing CROWD API with recall# F-1101-2015', function(done) {
    api.get('/api/crowd.json?recall=F-1101-2015')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      var res = res.body;
      //res.status.should.have.property('status', 200);
      res.results.should.have.property('recall_number','F-1101-2015');
      res.results.should.have.property('recall_crowd_count');
      crowd_count = res.results.recall_crowd_count;
      //console.log("crowd_count="+crowd_count);
      done();
    });  
  });

  it('testing CROWD POST API with recall# F-1101-2015', function(done) {
    var crowd_count_post = parseInt(crowd_count)+1;
    api.post('/api/crowd.json?recall=F-1101-2015')
    //.send({ recall: 'F-1101-2015'})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function(err, res) {
      if (err) return done(err);
      var res = res.body;
      
      res.results.should.have.property('recall_number','F-1101-2015');
      res.results.should.have.property('recall_crowd_count', crowd_count_post.toString());
      
      done();
    });  
  });

});