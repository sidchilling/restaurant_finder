var DirectoryListing = function() {
};

DirectoryListing.prototype.list = function(directory, successCallback, failureCallback) {
	return PhoneGap.exec(successCallback, failureCallback, 'DirectoryListPlugin', 'list', [directory]);
};

PhoneGap.addConstructor(function() {
	PhoneGap.addPlugin("directoryListing", new DirectoryListing());
});