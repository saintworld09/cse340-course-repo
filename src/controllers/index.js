// Home page controller
const showHomePage = async (req, res) => {
    const title = 'Home';

    res.render('home', {
        title,
        activePage: 'home'
    });
};

export { showHomePage };