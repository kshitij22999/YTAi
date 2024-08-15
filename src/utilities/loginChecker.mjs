
const loginChecker = (req) => {
    if(!req.user) { return false}
    return true
}

export default loginChecker;