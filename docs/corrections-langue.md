# Relecture des textes de la boutique — 27/11/2026

**Choix validé :** toute la boutique en **arabe standard simple** (avant : interface en darija, fiches en arabe standard).
Prix, commandes, stock et fonctionnement : **non modifiés**. Aucune information produit ajoutée.

## Vérification
- 66 écrans capturés : 11 écrans (langue, pack, masques, fiche masque, soins, fiche soin, panier, commande pack incomplet, commande, commande + erreurs) × FR / AR / EN × mobile (390 px) et ordinateur (1366 px). Aucune erreur JavaScript.
- Contrôle automatique : mots latins dans l'arabe (hors marques / noms de produit), restes de darija, anglais dans le français, français dans l'anglais. Résultat : 0 problème (faux positifs restants : « Poids net », « Pour the emulsion », le signe « ×1 »).
- Prix : 6 masques + 2 soins identiques dans les 3 langues ; panier 40 + 27 + 35 = 102 DH. Tests du calcul des prix : 10/10.

## Arabe — interface (darija → arabe standard)
| Avant | Après |
|---|---|
| الباك / الماسكات | الباقة / الأقنعة |
| السلة ديالي | سلتي |
| باك ديال 3 ماسكات | باقة من 3 أقنعة (accord 1 / 2 / 3-10 / 11+ automatique) |
| ما زال ما اخترتي باك | لم تختاري أي باقة بعد |
| زيدي ماسك واحد باش يكمل الباك. | أضيفي قناعاً واحداً آخر لإكمال باقتك. |
| كملي التسوق | متابعة التسوق |
| ثمن الوحدة / الثمن ما زال ما تحدّدش | سعر الوحدة / السعر لم يُحدَّد بعد |
| كيتحمّل… / ما تحمّلش المتجر. / عاودي | جارٍ التحميل… / تعذّر تحميل المتجر. / إعادة المحاولة |
| باش تكملي، اختاري اللغة ديالك. | للمتابعة، اختاري لغتك. |
| شحال من ماسك بغيتي تجمعي؟ | كم قناعاً تريدين أن تجمعي؟ |
| إيه، دوزي لباك 4 / لا، خلي الباك ديالي | نعم، الانتقال إلى الباقة من 4 أقنعة / إلغاء، الاحتفاظ بباقتي |
| كوّني الباك ديالك! | كوّني باقتك! |
| حيدي هاد الماسك / بدّلي هاد الماسك | إزالة هذا القناع / استبدال هذا القناع |
| كمّلي الطلب ديالك | أكملي طلبك |
| طريقة الأداء / التوصيل والأداء | طريقة الدفع / التوصيل والدفع |
| قلّبي على المدينة… | ابحثي عن مدينتك… |
| هاد الخانة ضرورية. | هذه الخانة إلزامية. |
| عافاك وضّحي أكثر. | يُرجى إضافة مزيد من التفاصيل. |
| ما يمكنش تدوزي الطلب دابا… | لا يمكن إتمام الطلب حالياً… |
| الطلبات مسدودة دابا. | الطلبات متوقفة حالياً. |
| ما تصيفطش الطلب. عاودي من بعد شوية. | تعذّر إرسال الطلب. يُرجى المحاولة بعد قليل. |
| صيفطتي بزاف ديال الطلبات… | تم إرسال عدد كبير من الطلبات… |
| شكراً، الطلب ديالك تسجّل! / غادي نتاصلو بيك باش نأكدوه. | شكراً لك، تم تسجيل طلبك! / سنتواصل معك لتأكيده. |
| منتجات العناية بالوحدة | منتجات العناية بالقطعة |
| العلامة / الكمية | العلامة التجارية / المحتوى |

(≈ 140 libellés arabes réécrits au total : `client/src/lib/i18n.js` et les pages Langue, Pack, Masques, Soins, Commande.)

## Arabe — fiches produit et données
| Où | Avant | Après |
|---|---|---|
| Collagen — description | أضيفيه إلى الباك للحظة خاصة بك. | أضيفيه إلى باقتك لتمنحي نفسك لحظة خاصة. |
| Real Glutathione — description | …مكانه بسرعة في الباك. | …مكانه بسرعة في باقتك. |
| Rose Gold — description | لمسة فخامة في الباك! | لمسة فخامة في باقتك! |
| Real Glutathione — point fort | المكوّن النجم، منذ اسم القناع. | المكوّن النجم الذي يحمل القناع اسمه. |
| ORJENA — point fort | يبرز منذ اسم المستحلب. | يبرز في اسم المستحلب نفسه. |
| Catégorie masques | ماسكات القماش | الأقنعة القماشية |

## Français
| Avant | Après | Pourquoi |
|---|---|---|
| Passer au checkout | Passer la commande | anglicisme |
| Mode d'emploi ORJENA / Yuja : « Nettoyez… Versez… Appliquez… » | « Nettoie ta peau, puis applique ton tonique… Verse… Applique-la… » | le site tutoie partout |
| Real Glutathione : « l'ingrédient vedette, dès le nom du masque » | « l'ingrédient vedette, qui donne son nom au masque » | tournure maladroite |
| Un masque n'est plus disponible… Modifie ton pack. | Un produit n'est plus disponible… Modifie ton panier. | concerne aussi les soins |
| Le catalogue a changé : vérifie ton pack | … vérifie ton panier | idem |
| À choisir | Pas encore choisi | plus clair |
| Elle est conservée. | Elle sera conservée. | temps |
| Prix du pack affiché ensuite | Prix du pack affiché à l'étape suivante | plus clair |
| Gratuit dès X d'achat | Gratuit dès X d'achats | orthographe |
| Merci de préciser davantage. | Merci d'ajouter quelques détails. | plus naturel |

## Anglais
| Avant | Après |
|---|---|
| Thank you, your order is registered! | Thank you, your order has been placed! |
| Free from X | Free on orders of X or more |
| To choose | Not chosen yet |
| Delivery details (titre) | Delivery |
| It is kept. | It will be kept. |
| The pack of 4 only keeps 4 / switch to the pack of 4 | A pack of 4 only holds 4 / switch to a pack of 4 |
| Pack price shown next | Pack price shown at the next step |
| Fancy some extra skincare? | Would you like some extra skincare? |
| Our skincare sold individually… | Our skincare is sold individually… |
| See skincare | View skincare |
| Product details (bandeau de la fiche) | Product sheet (évite le doublon avec « Product details ») |
| You want to add: | You'd like to add: |
| No mask is available right now. | No masks are available right now. |
| A mask is no longer available… change your pack. | A product is no longer available… update your cart. |
| Real Glutathione: "the star ingredient, right in the mask's name" | "the star ingredient that gives the mask its name" |

## Affichage (toutes langues)
- « Prix unitaire : » au panier de commande : espace avant « : » seulement en français (avant : aussi en anglais et en arabe).
- Arabe : les numéros d'exemple du téléphone (« 06 12 34 56 78 », « +212… ») sont isolés, sinon l'arabe inversait l'ordre des groupes de chiffres.
- Texte alternatif du logo : « mapetitecoree.ma » (avant : slogan anglais lu aussi en FR et AR).

## Non modifié (à savoir)
- Libellés des **modes de livraison et de paiement** : ils viennent de ton admin (Paramètres). Remplis bien les 3 langues ; sinon le français s'affiche par défaut.
- Le slogan « KOREAN & NATURAL SKINCARE » fait partie de l'image du logo.
- Arabe relu par moi, pas par une personne native [HYPOTHÈSE : correct et naturel, relecture native conseillée].
