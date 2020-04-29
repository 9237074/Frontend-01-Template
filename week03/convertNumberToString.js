function convertNumberToString(number, hex = 10) {
    let integer = Math.floor(number);
    let fraction = null;
    if (hex === 10){
		fraction = number.split(/\.\d*/)[0];
	}
    let string = ''
    while(integer > 0) {
      string = integer % hex + string;
      integer = Math.floor(integer / hex);
    }
    return fraction ? string + fraction : string;
}