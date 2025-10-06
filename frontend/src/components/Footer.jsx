const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-gray-400 py-5 text-center text-sm border-t border-gray-700 relative">
            <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
                <span>&copy; {new Date().getFullYear()} MovieVerse</span>
                {/* <span>Developed by Paritosh Sandhan</span> */}
                <span className="text-gray-500">All rights reserved</span>
            </div>

            {/* subtle glow behind the footer */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-800/20 to-transparent blur-lg rounded-t-lg" />
        </footer>
    );
};

export default Footer;
