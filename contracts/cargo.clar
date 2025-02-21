;; Cargo Contract

(define-data-var next-cargo-id uint u0)

(define-map cargo
  { id: uint }
  {
    owner: principal,
    description: (string-utf8 256),
    weight: uint,
    destination: (string-ascii 64)
  }
)

(define-public (register-cargo (description (string-utf8 256)) (weight uint) (destination (string-ascii 64)))
  (let
    ((cargo-id (+ (var-get next-cargo-id) u1)))
    (var-set next-cargo-id cargo-id)
    (ok (map-set cargo
      { id: cargo-id }
      {
        owner: tx-sender,
        description: description,
        weight: weight,
        destination: destination
      }
    ))
  )
)

(define-read-only (get-cargo (id uint))
  (map-get? cargo { id: id })
)

