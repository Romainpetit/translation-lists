Meteor.publish('publicLists', function() {
    return Lists.find({
        userId: {
            $exists: false
        }
    });
});

Meteor.publish('privateLists', function() {
    if (this.userId) {
        return Lists.find({
            userId: this.userId
        });
    } else {
        this.ready();
    }
});

Meteor.publish('todos', function(listId) {
    check(listId, String);

    return Todos.find({
        listId: listId
    });
});

Meteor.publish('booksSearch', function(query) {
    var self = this;
    try {
        var response = HTTP.get('http://api.mymemory.translated.net/get', {
            params: {
                q: query,
                langpair: "fr|en"
            }
        });

        _.each(response.data.responseData, function(item) {
            console.log(item);
            return item
        });

        self.ready();

    } catch (error) {
        console.log(error);
    }
});


	Meteor.methods({
		TranslateThis: function(query, listId) {
		      try {
		        // fill in the blanks here with params, timeout, etc.
		        var resultEN = HTTP.get('http://api.mymemory.translated.net/get', {
		            params: {
		                q: query,
		                langpair: "fr|en"
		            }
		        });
		        var resultES = HTTP.get('http://api.mymemory.translated.net/get', {
		            params: {
		                q: query,
		                langpair: "fr|es"
		            }
		        });
		        console.log(resultEN.data.responseData);
		        console.log(resultES.data.responseData);

	            console.log(Todos.insert({
			      listId: listId,
			      text_fr: query,
			      text_en: resultEN.data.responseData.translatedText,
			      text_es: resultES.data.responseData.translatedText,
			      checked: false,
			      createdAt: new Date()
			    }));
		        return resultEN.data.responseData;

		      } catch (_error) {
		        throw new Meteor.Error("No Result", "Failed to fetch...");
		      }
		}
	});

	// Meteor.methods({
	// 	TranslateThisES: function(query) {
	// 	      try {
	// 	        // fill in the blanks here with params, timeout, etc.
	// 	        var result = HTTP.get('http://api.mymemory.translated.net/get', {
	// 	            params: {
	// 	                q: query,
	// 	                langpair: "fr|es"
	// 	            }
	// 	        });
	// 	        return result.data.responseData;
	// 	        console.log(result.data.responseData);

	// 	      } catch (_error) {
	// 	        throw new Meteor.Error("No Result", "Failed to fetch...");
	// 	      }
	// 	}
	// });