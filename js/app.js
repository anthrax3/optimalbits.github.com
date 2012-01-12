define(['jquery', 
        'underscore',
        'ginger/ginger',
        'showdown',
        'js!jade.js',
        'js!moment.min.js'], function($, _, ginger, showdown){

$(function(){
var jade = require('jade');

ginger.route.root = '/'

ginger.route.listen(function(req){
  req.get(function(){
  
    req
      .enter('fadeIn')
      .render('/jade/main.jade', '/css/main.css')
      .exit('fadeOut')
        
    if(req.isLast()){
      req.redirect('/news');
      return;
    }
  
    req.get('news', '#content', function(){
      var data, urls;
      
      if(req.isLast()){
        req.custom(function(done){
          curl(['text!/data/news.json'], function(d){
            data = JSON.parse(d);
            req.data = _.pluck(data, 'url');
            done();
          });
        });
        
        req.exit('fadeOut');
        
        req.load(function (done){
          for(var i=0, len=req.data.length;i<len;i++){
            data[i].content = showdown.parse(req.data[i]);
            data[i].date = moment(data[i].date).fromNow();
            data[i].url = req.resourceRoute(data[i].url);
          }
          req.data = data;
          done();
        });
        
        req.render('/jade/news.jade', '/css/news.css', 'news');
        req.enter('fadeIn');
      }else{        
        req.get(':id', '#content', function() {
          req.custom(function(done){
            curl(['text!/data/news.json'], function(d){
              data = JSON.parse(d);
              req.data = _.pluck(data, 'url');
              done();
            });
          });
          
          var docUrl = '/data/news/'+req.params.id+'.json';
          
          req.exit('fadeOut');
          req.load(docUrl, function(done){
            for(var i=0, len=data.length;i<len;i++){
              if(data[i].url===docUrl){
                data[i].content = showdown.parse(req.data)
                data[i].date = moment(data[i].date).fromNow();
                data[i].url = req.url;
                req.data = data[i];
                break;
              }
            }
            done();
          });
          req.render('/jade/news-detail.jade', '/css/news.css', 'doc');
          req.enter('fadeIn');
        });
      }
    });
    
    // About
    req.get('about', '#content', function(){
      req.enter('fadeIn').render('/jade/about.jade').exit('fadeOut');
    });
      
    // Products
    req.get('products', '#products', function(){
    
      // render submenu.
      if(req.isLast()){
        req.enter('fadeIn');
        req.render('/jade/products.jade', '/css/products.css');
        req.exit('fadeOut');
      }
          
      req.get('castmill','#content', function(){
        req.exit('fadeOut').render('/jade/products/castmill.jade').enter('fadeIn');
      });
         
      req.get('ginger', '#content', function(){
        req.exit('fadeOut').render('/jade/products/ginger.jade').enter('fadeIn');
      });
    });
    
    // Partners
    req.get('partners', '#content', function(){
      req.exit('fadeOut').render('/jade/partners.jade').enter('fadeIn');
    });
      
    // Career
    req.get('career', '#content', function(){
      req.exit('fadeOut').render('/jade/career.jade').enter('fadeIn');
    });
      
    // Contact
    req.get('contact', '#content', function(){
      req.exit('fadeOut').render('/jade/contact.jade').enter('fadeIn');
    });
    
    // Copyright
    req.get('copyright', '#content', function(){
      req.exit('fadeOut').render('/jade/copyright.jade').enter('fadeIn');
    });
  })
});
});
  
});
