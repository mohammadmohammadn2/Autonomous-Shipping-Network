;; Port Management Contract

(define-data-var next-port-id uint u0)

(define-map ports
  { id: uint }
  {
    name: (string-ascii 64),
    capacity: uint,
    available-space: uint
  }
)

(define-public (register-port (name (string-ascii 64)) (capacity uint))
  (let
    ((port-id (+ (var-get next-port-id) u1)))
    (var-set next-port-id port-id)
    (ok (map-set ports
      { id: port-id }
      {
        name: name,
        capacity: capacity,
        available-space: capacity
      }
    ))
  )
)

(define-public (update-port-space (id uint) (space-change int))
  (let
    ((port (unwrap! (map-get? ports { id: id }) (err u404))))
    (asserts! (>= (to-int (get available-space port)) (- space-change)) (err u400))
    (ok (map-set ports
      { id: id }
      (merge port {
        available-space: (to-uint (+ (to-int (get available-space port)) space-change))
      })
    ))
  )
)

(define-read-only (get-port (id uint))
  (map-get? ports { id: id })
)

