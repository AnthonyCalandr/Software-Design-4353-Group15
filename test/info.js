let testInfo = (name, address, address2, city,zipcode) => {
	let err = []
	if(name.length > 50){
		err.push("Length of name is greater than 50")
	}
	if(address.length > 100){
		err.push("Length of address is greater than 100")
	}
	if(city.length > 100){
		err.push("Length of city is greater than 100")
	}
	if(zipcode.length < 5 || zipcode.length > 9){
		err.push("Length of zipcode is greater than 9 or less than 5")
	}
	let t = [err.length, ...err]
	if(err.length > 1){
		return t
	}
    else{
		return "No Errors"
	}
}

module.exports = testInfo