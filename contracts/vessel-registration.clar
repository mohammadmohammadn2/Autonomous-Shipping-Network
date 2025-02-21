;; Vessel Registration Contract

(define-data-var next-vessel-id uint u0)

(define-map vessels
  { id: uint }
  {
    owner: principal,
    name: (string-ascii 64),
    capacity: uint
  }
)

(define-public (register-vessel (name (string-ascii 64)) (capacity uint))
  (let
    ((vessel-id (+ (var-get next-vessel-id) u1)))
    (var-set next-vessel-id vessel-id)
    (ok (map-set vessels
      { id: vessel-id }
      {
        owner: tx-sender,
        name: name,
        capacity: capacity
      }
    ))
  )
)

(define-read-only (get-vessel (id uint))
  (map-get? vessels { id: id })
)

