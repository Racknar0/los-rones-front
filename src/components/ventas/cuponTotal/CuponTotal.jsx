import React from 'react'

const CuponTotal = ({
    cupon,
    setCupon,
    handleCuponChange
}) => {
  return (
    <>
        <p className="fs-4 mt-4 text-center">
                        Aplicar un cupón al total de la compra
                    </p>
                    <div className="coupon_total_cntainer d-flex flex-column align-items-center">
                        <input
                            type="text"
                            placeholder="Código del cupón"
                            className="form-control"
                            value={cupon}
                            onChange={(e) => setCupon(e.target.value)}
                            onBlur={handleCuponChange}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault(); // evita un submit accidental
                                    e.target.blur(); // dispara onBlur una sola vez
                                }
                            }}
                        />
                    </div>
    </>
  )
}

export default CuponTotal