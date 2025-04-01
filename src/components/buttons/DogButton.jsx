import React from 'react';
import './DogButton.scss';
const DogButton = ({ handleSubmit, loading, disabled }) => {
    return (
        <div
            className="dog-container"
            onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
            }}
        >
            <div className="button-container">
                <div className="dog">
                    <div className="tail"></div>
                    <div className="body"></div>
                    <div className="head">
                        <div className="eyes">
                            <div className="left"></div>
                            <div className="right"></div>
                        </div>
                        <div className="nuzzle">
                            <div className="mouth">
                                <div className="tongue"></div>
                            </div>
                            <div className="nose">
                                <div className="nostrils"></div>
                                <div className="highlight"></div>
                            </div>
                        </div>
                    </div>
                    <div className="ears">
                        <div className="left"></div>
                        <div className="right"></div>
                    </div>
                </div>
                <button>
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </button>
                <div className="paw"></div>
                <div className="paw top"></div>
            </div>
        </div>
    );
};

export default DogButton;
