const collegeMailPatterns = {
    "Institute of Engineering and Technology, DAVV": /^(2[1-5])[a-z]{2,4}(?:0[0-9]{2}|1[0-9]{2}|200)@ietdavv\.edu\.in$/
}

export const validateCollegeEmail = (email, college) => {
    const pattern = collegeMailPatterns[college];
    if (!pattern) {
        return false; // College not found in patterns
    }
    return pattern.test(email);
}