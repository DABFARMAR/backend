import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

const createUser = async (usersToCreate) => {
    const {
        name,
        email,
        password,
        password_second,
        cellphone
    } = usersToCreate;
    if (password !== password_second) {
        return {
            code: 400,
            message: 'Passwords do not match'
        };
    }
    const user = await db.User.findOne({
        where: {
            email: email
        }
    });
    if (user) {
        return {
            code: 400,
            message: 'User already exists'
        };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
        name,
        email,
        password: encryptedPassword,
        cellphone,
        status: true
    });
    return {
        code: 200,
        message: 'User created successfully with ID: ' + newUser.id,
    }
};

const getUserById = async (id) => {
    return {
        code: 200,
        message: await db.User.findOne({
            where: {
                id: id,
                status: true,
            }
        })
    };
}

const updateUser = async (req) => {
    const user = db.User.findOne({
        where: {
            id: req.params.id,
            status: true,
        }
    });
    const payload = {};
    payload.name = req.body.name ?? user.name;
    payload.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
    payload.cellphone = req.body.cellphone ?? user.cellphone;
    await db.User.update(payload, {
        where: {
            id: req.params.id
        }

    });
    return {
        code: 200,
        message: 'User updated successfully'
    };
}

const deleteUser = async (id) => {
    /* await db.User.destroy({
        where: {
            id: id
        }
    }); */
    const user = db.User.findOne({
        where: {
            id: id,
            status: true,
        }
    });
    await  db.User.update({
        status: false
    }, {
        where: {
            id: id
        }
    });
    return {
        code: 200,
        message: 'User deleted successfully'
    };
}




const getAllUsers = async () => {
    return {
	code : 200,
	message : await db.User.findAll({ //select * from Users where status = true	
	    where : {
		status : true,	    
	    }
	
	})
    }
}


const getUsersByFilters = async (req) => {
    const filtersMain = {};
    const filtersSession = {};
    let relationRequired = true;
    
    if(req.query.status){
	filtersMain.status = Boolean(req.query.status);
	
    };
    if(req.query.occurrence){
	filtersMain.name = { [Op.like]: req.query.occurrence };
    };

    if(req.query.from && req.query.to){

	const from = new Date(req.query.from);
	const to = new Date(req.query.to);
	filtersSession.CreatedAt = { [Op.between] : [from, to]  }
	
    } else if(req.query.from){
	
	const from = new Date(req.query.from);
	filtersSession.CreatedAt = { [Op.gt] : from  }
	
    } else if(req.query.to){
	
	const to = new Date(req.query.to);
	filtersSession.CreatedAt = { [Op.lt] : to }
	
    } else {
	relationRequired = false; 
    };

    const response = await db.User.findAll({
	where : filtersMain,
	include :[{
	    model : db.Session,
	    required : relationRequired,
	    attributes : ['createdAt'],
	    where : filtersSession ,
	}]
    });
    
    return {
	code : 200,
	message : response
    }
}



const bulkCreate = async (usersToCreate) => { //[{},{},{}]
    let usersError = 0;
    const result = usersToCreate.map(async (user) => {
	const newUser = await createUser(user);
	newUser.code === 400 ? usersError++ : null ;
    });

    await Promise.all(result);
    return {success : usersToCreate.length - usersError , error : usersError};

   
}



export default {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    bulkCreate,
    getUsersByFilters,
    getAllUsers,
}
