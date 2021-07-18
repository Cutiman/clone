
module.exports = function(io) {
	/**
	io.emit('dataT', {
		isLogin: io.isLogin,
		user: info || {}
	});
	*/

	ControlUser.contruct(io, 'name exp phone gold xu ketSat lastDate regDate');
	io.on('dataT', (data)=>{
		ControlDataT(io, data);
	});

	io.on('disconnect', function(){
		io.disconnect();
        console.log('io disconnect.');
    });
};
