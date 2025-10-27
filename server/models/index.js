import { Deck } from './deck.js'
import { Flashcard } from './flashcard.js'
import { Review } from './review.js'
import { Tag } from './tag.js'
import { User } from './user.js'

User.hasMany(Deck, { foreignKey: "user_id",  onDelete: "CASCADE", onUpdate: "CASCADE" })
Deck.belongsTo(User, { foreignKey: "user_id", onDelete: "CASCADE", onUpdate: "CASCADE" })

Deck.hasMany(Flashcard, { foreignKey: "deck_id", as: "flashcard", onDelete: "CASCADE" })
Flashcard.belongsTo(Deck, { foreignKey: "deck_id", as: "deck", onDelete: "CASCADE" })

Deck.hasMany(Tag, { foreignKey: "deck_id", as: "tag" })
Tag.belongsTo(Deck, { foreignKey: "deck_id", as: "deck" })

Flashcard.hasOne(Review, { foreignKey: "flashcard_id", as: "review", onDelete: "CASCADE" })
Review.belongsTo(Flashcard, { foreignKey: "flashcard_id", as: "flashcard", onDelete: "CASCADE" })

export { Deck, Flashcard, Review, Tag, User }