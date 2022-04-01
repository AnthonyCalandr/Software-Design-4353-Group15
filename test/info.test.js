const tInfo = require('./info.js')

tInfo('Checking to see if we get errors with the Information Lengths', () => {
	expect(tInfo("John Doe", "Main street", "Main street 2", "Houston", "77133")).toBe("No Errors")
})

tInfo('Checking to see if we get errors with the Information Lengths', () => {
	expect(tInfo("John doeJohn doeJohn doeJohn doeJohn doeJohn doeJohn doe", "Main street", "Main street 2", "Houston", "77133")).toBe("Length of name is greater than 50")
})

tInfo('Checking to see if we get errors with the Information Lengths', () => {
	expect(tInfo("John doe", "Main streetMain streetMain streetMain streetMain streetMain streetMain streetMain streetMain streetMain street", "Main street 2", "Houston", "77133")).toBe("Length of address is greater than 100")
})

tInfo('Checking to see if we get errors with the Information Lengths', () => {
	expect(tInfo("John doe", "Main street", "Main street2Main street2Main street2Main street2Main street2Main street2Main street2Main street2Main street2", "Houston", "77133")).toBe("Length of address is greater than 100")
})

tInfo('Checking to see if we get errors with the Information Lengths', () => {
	expect(tInfo("John doe", "Main street", "Main street2", "HoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonHouston", "77133")).toBe("Length of city is greater than 100")
})

tInfo('Checking to see if we get errors with the Information Lengths', () => {
	expect(tInfo("John doe", "Main street", "Main street2", "Houston", "713")).toBe("Length of zipcode is greater than 9 or less than 5")
})

tInfo('Checking to see if we get errors with the Information Lengths', () => {
	expect(tInfo("John doe", "Main street", "Main street2", "Houston", "713713713713")).toBe("Length of zipcode is greater than 9 or less than 5")
})